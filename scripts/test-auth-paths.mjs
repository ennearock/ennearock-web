import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import test from "node:test";

// Load the standalone pure TS helper without adding a test-runner dependency.
const source = await readFile(new URL("../src/lib/auth/paths.ts", import.meta.url), "utf8");
const { authenticatedPath, safeDashboardPath, safeWorkspacePath } = await import(
  `data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source)).toString("base64")}`
);

test("an unspecified destination stays role-aware", () => {
  for (const value of [undefined, null, ""]) {
    assert.equal(safeWorkspacePath(value), "");
    assert.equal(authenticatedPath(value, false), "/account");
    assert.equal(authenticatedPath(value, true), "/dashboard");
  }
});

test("client and administrator deep links retain local query parameters", () => {
  assert.equal(authenticatedPath("/account/requests?status=open#details", false), "/account/requests?status=open");
  assert.equal(authenticatedPath("/account/profile", true), "/account/profile");
  assert.equal(authenticatedPath("/dashboard/portfolio?edit=123", true), "/dashboard/portfolio?edit=123");
});

test("members cannot enter the admin workspace through a next parameter", () => {
  for (const value of ["/dashboard", "/dashboard/portfolio?edit=123", "/account/../dashboard"]) {
    assert.equal(authenticatedPath(value, false), "/account");
  }
});

test("rejects external, malformed, non-workspace and ambiguous paths", () => {
  for (const value of [
    "https://example.com/dashboard", "//example.com/account", "/\\example.com/account",
    "/account\\..\\dashboard", "/accounting", "/dashboard-evil", "/contact",
    "/account/../../login", "/account/%2f%2fevil.test", "/account/%5cevil", "/account/%00",
    "/account\n/requests", "/account /requests", "javascript:alert(1)", {},
  ]) {
    assert.equal(safeWorkspacePath(value), "", String(value));
    assert.equal(authenticatedPath(value, false), "/account", String(value));
    assert.equal(authenticatedPath(value, true), "/dashboard", String(value));
  }
});

test("existing admin guard remains restricted to dashboard paths", () => {
  assert.equal(safeDashboardPath("/account/profile"), "/dashboard");
  assert.equal(safeDashboardPath("/dashboard/settings?tab=site"), "/dashboard/settings?tab=site");
  assert.equal(safeDashboardPath("//example.com/dashboard"), "/dashboard");
});
