const FALLBACK_EMAIL = "hello@ennearock.com";
const MAX_REQUEST_BYTES = 20_000;

const projectTypes = {
  website: "Marketing website",
  "web-app": "Web application / SaaS",
  template: "Template question",
  "product-partnership": "Product partnership",
  other: "Something else",
} as const;

const budgets = {
  "under-5k": "Under €5k",
  "5k-10k": "€5k–€10k",
  "10k-25k": "€10k–€25k",
  "25k-plus": "€25k+",
  "not-sure": "Not sure yet",
} as const;

type ContactPayload = {
  budget: keyof typeof budgets;
  company: string;
  email: string;
  interest: string;
  message: string;
  name: string;
  projectType: keyof typeof projectTypes;
};

const responseHeaders = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, { headers: responseHeaders, status });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function singleLine(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, maxLength + 1);
}

function multiLine(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/\0/g, "")
    .trim()
    .slice(0, maxLength + 1);
}

function validatePayload(raw: unknown):
  | { data: ContactPayload; valid: true }
  | { message: string; valid: false } {
  if (!isRecord(raw)) {
    return { message: "The request body must be a JSON object.", valid: false };
  }

  const honeypot = singleLine(raw.website, 200);
  if (honeypot) {
    return { message: "We couldn’t process that submission.", valid: false };
  }

  const name = singleLine(raw.name, 80);
  const email = singleLine(raw.email, 254).toLocaleLowerCase();
  const company = singleLine(raw.company, 120);
  const projectType = singleLine(raw.projectType, 40);
  const budget = singleLine(raw.budget, 40);
  const interest = singleLine(raw.interest, 120);
  const message = multiLine(raw.message, 3000);

  if (name.length < 2 || name.length > 80) {
    return { message: "Enter a name between 2 and 80 characters.", valid: false };
  }

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return { message: "Enter a valid email address.", valid: false };
  }

  if (company.length > 120) {
    return { message: "Company must be 120 characters or fewer.", valid: false };
  }

  if (!(projectType in projectTypes)) {
    return { message: "Choose a valid project type.", valid: false };
  }

  if (!(budget in budgets)) {
    return { message: "Choose a valid budget range.", valid: false };
  }

  if (interest && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(interest)) {
    return { message: "The selected template is not valid.", valid: false };
  }

  if (message.length < 20 || message.length > 3000) {
    return {
      message: "Tell us a little more using 20 to 3,000 characters.",
      valid: false,
    };
  }

  return {
    data: {
      budget: budget as keyof typeof budgets,
      company,
      email,
      interest,
      message,
      name,
      projectType: projectType as keyof typeof projectTypes,
    },
    valid: true,
  };
}

function createMailto(payload: ContactPayload) {
  const subject = `Project inquiry — ${projectTypes[payload.projectType]}`;
  const body = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.company ? `Company: ${payload.company}` : null,
    `Project type: ${projectTypes[payload.projectType]}`,
    `Budget: ${budgets[payload.budget]}`,
    payload.interest ? `Interested in: ${payload.interest}` : null,
    "",
    payload.message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
  const query = new URLSearchParams({ body, subject });

  return `mailto:${FALLBACK_EMAIL}?${query.toString()}`;
}

function fallbackResponse(payload: ContactPayload) {
  return jsonResponse({
    delivered: false,
    mailto: createMailto(payload),
    message:
      "Online delivery is not connected right now, so your message has not been sent. Open the prepared email to contact us directly.",
    status: "fallback",
  });
}

async function persistInquiry(payload: ContactPayload) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !serviceRoleKey) return;

  try {
    await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/contact_inquiries`, {
      body: JSON.stringify({
        company: payload.company || null,
        email: payload.email,
        message: payload.message,
        metadata: {
          budget: payload.budget,
          interest: payload.interest || null,
          projectType: payload.projectType,
          source: "website-contact-form",
        },
        name: payload.name,
        subject: projectTypes[payload.projectType],
      }),
      cache: "no-store",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      method: "POST",
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    // Email delivery remains useful even if optional CRM persistence is offline.
  }
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");

  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return jsonResponse(
      { delivered: false, message: "The request is too large.", status: "error" },
      413,
    );
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonResponse(
      {
        delivered: false,
        message: "Send this form as JSON.",
        status: "error",
      },
      415,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      { delivered: false, message: "The form data is not valid JSON.", status: "error" },
      400,
    );
  }

  const validation = validatePayload(body);
  if (!validation.valid) {
    return jsonResponse(
      { delivered: false, message: validation.message, status: "error" },
      400,
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim();
  const teamEmail = process.env.CONTACT_TEAM_EMAIL?.trim() || FALLBACK_EMAIL;
  const persistence = persistInquiry(validation.data);

  if (!resendApiKey || !fromEmail) {
    await persistence;
    return fallbackResponse(validation.data);
  }

  const payload = validation.data;
  const subject = `[Ennearock inquiry] ${projectTypes[payload.projectType]} — ${payload.name}`;
  const text = [
    "New website inquiry",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.company ? `Company: ${payload.company}` : "Company: Not provided",
    `Project type: ${projectTypes[payload.projectType]}`,
    `Budget: ${budgets[payload.budget]}`,
    payload.interest ? `Catalog interest: ${payload.interest}` : null,
    "",
    "Project brief",
    payload.message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      body: JSON.stringify({
        from: fromEmail,
        reply_to: payload.email,
        subject,
        text,
        to: [teamEmail],
      }),
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `contact-${crypto.randomUUID()}`,
      },
      method: "POST",
      signal: AbortSignal.timeout(10_000),
    });

    await persistence;

    if (!resendResponse.ok) return fallbackResponse(payload);

    return jsonResponse({
      delivered: true,
      message: "Your message is on its way. We’ll reply within two business days.",
      status: "sent",
    });
  } catch {
    await persistence;
    return fallbackResponse(payload);
  }
}
