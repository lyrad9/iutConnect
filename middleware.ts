import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { authRoutes, DEFAULT_REDIRECT, DEFAULT_REDIRECT_ADMIN } from "./routes";
const isSignInPage = createRouteMatcher([
  "/sign-up",
  "/verify-email",
  "/auth-admin-iut",
  "/register",
  "/login",
]);
const isProtectedRoute = createRouteMatcher([
  "/((?!sign-up|verify-email|auth-admin-iut|register|login|api|trpc).*)",
]);

export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, "/");
    }
    if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, "/sign-up");
    }
  },
  {
    cookieConfig: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 jours
    },
  }
);

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
