import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user profile to check approval status
  let profile = null;
  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("approval_status, role")
      .eq("user_id", user.id)
      .single();

    profile = profileData;
  }

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/bfp") ||
    pathname.startsWith("/stations");

  // Protect internal routes - user must be authenticated
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check approval status for protected routes
  if (isProtectedRoute && user && profile) {
    if (profile.approval_status !== "approved") {
      // Redirect pending users to pending approval page
      return NextResponse.redirect(new URL("/pending-approval", request.url));
    }

    // Role check: Admin routes require admin role
    if (pathname.startsWith("/admin") && profile.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Redirect authenticated users away from login/register
  if ((pathname === "/login" || pathname === "/register-station") && user) {
    if (profile && profile.approval_status === "approved") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (profile && profile.approval_status === "pending") {
      return NextResponse.redirect(new URL("/pending-approval", request.url));
    }
  }

  // Redirect pending approval users who try to access login/register
  if ((pathname === "/login" || pathname === "/register-station") && user && profile?.approval_status === "pending") {
    return NextResponse.redirect(new URL("/pending-approval", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
