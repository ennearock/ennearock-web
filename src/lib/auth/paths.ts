const DEFAULT_DASHBOARD_PATH = "/dashboard";
const DEFAULT_ACCOUNT_PATH = "/account";
const INTERNAL_ORIGIN = "https://ennearock.invalid";

function workspaceUrl(value: FormDataEntryValue | string | null | undefined) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\u0000-\u0020\u007f]/.test(value)
  ) {
    return null;
  }

  try {
    const parsed = new URL(value, INTERNAL_ORIGIN);
    if (
      parsed.origin !== INTERNAL_ORIGIN ||
      /%(?:2f|5c|0[0-9a-f]|1[0-9a-f]|7f)/i.test(parsed.pathname)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function isWithin(path: string, root: string) {
  return path === root || path.startsWith(`${root}/`);
}

/** An empty fallback keeps the role-aware destination undecided until sign-in. */
export function safeWorkspacePath(
  value: FormDataEntryValue | string | null | undefined,
  fallback = "",
) {
  const parsed = workspaceUrl(value);
  if (
    !parsed ||
    (!isWithin(parsed.pathname, DEFAULT_ACCOUNT_PATH) &&
      !isWithin(parsed.pathname, DEFAULT_DASHBOARD_PATH))
  ) {
    return fallback;
  }
  return `${parsed.pathname}${parsed.search}`;
}

export function authenticatedPath(
  value: FormDataEntryValue | string | null | undefined,
  isAdmin: boolean,
) {
  const path = safeWorkspacePath(value);
  if (!path) return isAdmin ? DEFAULT_DASHBOARD_PATH : DEFAULT_ACCOUNT_PATH;
  const parsed = new URL(path, INTERNAL_ORIGIN);
  return !isAdmin && isWithin(parsed.pathname, DEFAULT_DASHBOARD_PATH)
    ? DEFAULT_ACCOUNT_PATH
    : path;
}

export function safeDashboardPath(
  value: FormDataEntryValue | string | null | undefined,
  fallback = DEFAULT_DASHBOARD_PATH,
) {
  const parsed = workspaceUrl(value);
  if (!parsed || !isWithin(parsed.pathname, DEFAULT_DASHBOARD_PATH)) {
    return fallback;
  }
  return `${parsed.pathname}${parsed.search}`;
}
