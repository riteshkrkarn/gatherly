import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const protectedRoutes = [
    "/dashboard",
    "/profile-page",
    "/events",
    "/booking-page",
    "/my-events",
    "/update-user",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  //Organizer Routes
  const organizerRoutes = ["/create-event"];
  const isOrganizerRoute = organizerRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  if (isOrganizerRoute && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (!token.isOrganizer) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/",
    "/about/:path*",
    "/verify/:path*",
    "/dashboard/:path*",
    "/create-event/:path*",
    "/my-events/:path*",
    "/profile-page/:path*",
    "/booking-page/:path*",
    "/events/:path*",
  ],
};
