import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const legacyDestination = {
    "/dashboard/billing": "/dashboard",
    "/dashboard/projects": "/dashboard/portfolio",
    "/dashboard/templates": "/dashboard",
  }[request.nextUrl.pathname];

  if (legacyDestination) {
    const destination = request.nextUrl.clone();
    destination.pathname = legacyDestination;
    destination.search = "";
    return NextResponse.redirect(destination, 308);
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*", "/login", "/signup"],
};
