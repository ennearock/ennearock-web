import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { compileFunction } from "node:vm";
import ts from "typescript";

// Exercise the real server modules with isolated Auth/PostgREST adapters.
// These tests require no credentials and never access a hosted project.
function loadTs(relativePath, dependencies = {}) {
  const source = readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const compiledModule = { exports: {} };
  compileFunction(outputText, ["require", "module", "exports"], { filename: relativePath })(
    (name) => {
      if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    },
    compiledModule,
    compiledModule.exports,
  );
  return compiledModule.exports;
}

const validation = loadTs("src/lib/account/validation.ts");
const idle = { status: "idle", message: "" };
const user = {
  id: "11111111-1111-4111-8111-111111111111", email: "alice@example.test",
  fullName: "Alice", company: "Alice Studio", website: null, avatarUrl: null, isAdmin: false,
};

function form(values) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

function fixture(options = {}) {
  const calls = [];
  const responses = options.responses ?? {};
  const client = {
    auth: {
      async getUser() {
        calls.push(["getUser"]);
        return options.authResponse ?? { data: { user }, error: null };
      },
    },
    from(table) {
      calls.push(["from", table]);
      const result = responses[table] ?? { data: { id: user.id }, error: null };
      const builder = {
        then(resolve, reject) { return Promise.resolve(result).then(resolve, reject); },
      };
      for (const method of ["select", "eq", "order", "limit", "update", "insert", "maybeSingle"]) {
        builder[method] = (...args) => { calls.push([method, table, ...args]); return builder; };
      }
      return builder;
    },
  };
  const dependencies = {
    "server-only": {},
    react: { cache: (fn) => fn },
    "next/cache": { revalidatePath: (...args) => calls.push(["revalidate", ...args]) },
    "@/lib/auth/account": {
      async requireAccountUser(path) {
        calls.push(["requireAccountUser", path]);
        if (options.anonymous) throw new Error("LOGIN_REQUIRED");
        return user;
      },
    },
    "@/lib/supabase/server": { async createServerSupabaseClient() { return client; } },
    "@/lib/account/validation": validation,
  };
  return {
    calls,
    actions: loadTs("src/app/account/actions.ts", dependencies),
    data: loadTs("src/lib/account/data.ts", dependencies),
  };
}

const validProfile = { fullName: "Alice Updated", company: "", website: "https://example.test" };
const validRequest = { subject: "New website", message: "I would like to discuss a new website for my studio." };

test("profile validation accepts only safe display fields and HTTP websites", () => {
  assert.deepEqual(validation.profileFields(form({ ...validProfile, role: "admin" })).data, {
    full_name: "Alice Updated", company: null, website: "https://example.test",
  });
  for (const website of ["javascript:alert(1)", "ftp://example.test", "https://user:secret@example.test", "not-a-url"]) {
    assert.ok(validation.profileFields(form({ ...validProfile, website })).error);
  }
  assert.ok(validation.profileFields(form({ ...validProfile, fullName: "a" })).error);
  assert.ok(validation.profileFields(form({ ...validProfile, company: "a".repeat(121) })).error);
});

test("project and request length boundaries are enforced on the server", () => {
  for (const name of ["", "a", "a".repeat(101)]) assert.ok(validation.projectFields(form({ name })).error);
  assert.equal(validation.projectFields(form({ name: "  A project  " })).data.name, "A project");
  assert.ok(validation.requestFields(form({ ...validRequest, subject: "ab" })).error);
  assert.ok(validation.requestFields(form({ ...validRequest, message: "short" })).error);
  assert.ok(validation.requestFields(form({ ...validRequest, message: "a".repeat(3001) })).error);
});

test("all mutations require authentication before querying or writing data", async () => {
  for (const name of ["saveProfileAction", "createProjectAction", "createRequestAction"]) {
    const { calls, actions } = fixture({ anonymous: true });
    await assert.rejects(actions[name](idle, form({})), /LOGIN_REQUIRED/);
    assert.equal(calls.length, 1);
    assert.equal(calls[0][0], "requireAccountUser");
  }
});

test("profile updates are scoped to the verified owner and cannot promote a member", async () => {
  const { actions, calls } = fixture();
  const result = await actions.saveProfileAction(idle, form({
    ...validProfile, id: "someone-else", role: "admin", email: "owner@example.test", plan: "studio",
  }));
  assert.equal(result.status, "success");
  assert.deepEqual(calls.find(([method]) => method === "update"), ["update", "profiles", {
    full_name: "Alice Updated", company: null, website: "https://example.test",
  }]);
  assert.deepEqual(calls.find(([method]) => method === "eq"), ["eq", "profiles", "id", user.id]);
  assert.ok(calls.some(([method]) => method === "revalidate"));
});

test("a missing profile does not report a successful save", async () => {
  const { actions, calls } = fixture({ responses: { profiles: { data: null, error: null } } });
  assert.equal((await actions.saveProfileAction(idle, form(validProfile))).status, "error");
  assert.ok(!calls.some(([method]) => method === "revalidate"));
});

test("project creation ignores supplied ownership, status, and deployment fields", async () => {
  const { actions, calls } = fixture();
  assert.equal((await actions.createProjectAction(idle, form({
    name: "Private draft", user_id: "someone-else", status: "active", custom_domain: "ennearock.com",
  }))).status, "success");
  assert.deepEqual(calls.find(([method]) => method === "insert"), ["insert", "user_projects", {
    user_id: user.id, name: "Private draft", status: "draft",
  }]);
});

test("requests use verified identity and never accept internal fields", async () => {
  const { actions, calls } = fixture();
  assert.equal((await actions.createRequestAction(idle, form({
    ...validRequest, user_id: "someone-else", email: "owner@example.test", status: "resolved",
    metadata: '{"admin":true}', name: "Impersonated owner",
  }))).status, "success");
  assert.deepEqual(calls.find(([method]) => method === "insert"), ["insert", "contact_inquiries", {
    user_id: user.id, email: user.email, name: user.fullName, company: user.company, ...validRequest,
  }]);
});

test("requests reject an expired, mismatched, or email-less auth identity before writing", async () => {
  for (const authResponse of [
    { data: { user: null }, error: { code: "session_not_found" } },
    { data: { user: { ...user, id: "someone-else" } }, error: null },
    { data: { user: { ...user, email: null } }, error: null },
  ]) {
    const { actions, calls } = fixture({ authResponse });
    assert.equal((await actions.createRequestAction(idle, form(validRequest))).status, "error");
    assert.ok(!calls.some(([method]) => method === "insert"));
  }
});

test("database failures do not report success or leak raw error details", async () => {
  for (const [action, table, input] of [
    ["saveProfileAction", "profiles", validProfile],
    ["createProjectAction", "user_projects", { name: "Private draft" }],
    ["createRequestAction", "contact_inquiries", validRequest],
  ]) {
    const { actions, calls } = fixture({ responses: { [table]: { data: null, error: { message: "PRIVATE DETAIL", code: "42501" } } } });
    const result = await actions[action](idle, form(input));
    assert.equal(result.status, "error");
    assert.ok(!result.message.includes("PRIVATE DETAIL"));
    assert.ok(!calls.some(([method]) => method === "revalidate"));
  }
});

test("private reads filter by verified owner and exclude internal JSON fields", async () => {
  const project = { id: "project-a", name: "Alice project", status: "draft", custom_domain: null, updated_at: "2026-01-01" };
  const inquiry = { id: "request-a", ...validRequest, status: "new", created_at: "2026-01-01", updated_at: "2026-01-01" };
  const { data, calls } = fixture({ responses: {
    user_projects: { data: [project], error: null },
    contact_inquiries: { data: [inquiry], error: null },
  } });
  const result = await data.getAccountData();
  assert.deepEqual(result.projects, [project]);
  assert.deepEqual(result.inquiries, [inquiry]);
  assert.equal(result.loadError, null);
  for (const table of ["user_projects", "contact_inquiries"]) {
    assert.ok(calls.some(([method, target, column, value]) => method === "eq" && target === table && column === "user_id" && value === user.id));
    const projection = calls.find(([method, target]) => method === "select" && target === table)[2];
    assert.ok(!/[\*]|metadata|settings|email/.test(projection));
  }
});

test("unauthenticated reads propagate the login redirect and failed queries show an error", async () => {
  await assert.rejects(fixture({ anonymous: true }).data.getAccountData(), /LOGIN_REQUIRED/);
  const { data } = fixture({ responses: {
    user_projects: { data: null, error: { code: "42P01" } },
    contact_inquiries: { data: [], error: null },
  } });
  const result = await data.getAccountData();
  assert.deepEqual(result.projects, []);
  assert.ok(result.loadError);
});
