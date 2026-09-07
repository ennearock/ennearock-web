const DEFAULT_DASHBOARD_PATH = "/dashboard";

export function safeDashboardPath(
  value: FormDataEntryValue | string | null | undefined,
  fallback = DEFAULT_DASHBOARD_PATH,
) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  try {
    const parsed = new URL(value, "https://ennearock.invalid");
    const isDashboard =
      parsed.pathname === DEFAULT_DASHBOARD_PATH ||
      parsed.pathname.startsWith(`${DEFAULT_DASHBOARD_PATH}/`);

    if (parsed.origin !== "https://ennearock.invalid" || !isDashboard) {
      return fallback;
    }

    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return fallback;
  }
}

