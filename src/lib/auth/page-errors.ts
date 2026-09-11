const AUTH_PAGE_ERRORS: Record<string, string> = {
  admin_setup:
    "Your account is valid, but the admin database is not ready. Apply the Supabase migrations and grant this account the admin role.",
  confirmation:
    "That confirmation link is invalid or has expired. Request a new email and try again.",
  google_disabled:
    "Google sign-in is not enabled in Supabase yet. Enable the Google provider or use email and password.",
  oauth:
    "Google sign-in could not be completed. Please try again or use email and password.",
  oauth_cancelled:
    "Google sign-in was cancelled. You can try again when you are ready.",
  unauthorized:
    "This account is signed in but has not been granted access to the admin workspace.",
};

export function authPageErrorMessage(code: string | null | undefined) {
  return code ? AUTH_PAGE_ERRORS[code] : undefined;
}
