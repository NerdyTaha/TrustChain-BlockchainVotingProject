import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const verifyToken = async (token: string, url: string) => {
  try {
    const response = await fetch(`${url}/api/auth/verifytoken`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });

    if (!response.ok) throw new Error("Token verification failed");

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      throw new Error("Response was not JSON");
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublicPath = ["/"].includes(pathname);
  const url = req.nextUrl.origin;

  const token = req.cookies.get("token")?.value || "";
  const isLoggedIn = !!token;

  if (!isLoggedIn && !isPublicPath) {
    console.log("Not logged in, redirecting to public login page");
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }
  if (isLoggedIn) {
    const user = await verifyToken(token, url);
    if (!user.data) {
      console.log("Token verification failed, redirecting to login");
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
    const { role, isApproved } = user.data;
    if (isApproved) {
      const dashboardPath = `/${role}/dashboard`;

      if (isPublicPath) {
        return NextResponse.redirect(
          new URL(dashboardPath, req.nextUrl.origin)
        );
      }

      return NextResponse.next();
    }

    if (!isApproved) {
      console.log("User is not admin approved, redirecting to 'not-approved'");
      return NextResponse.redirect(
        new URL("/not-approved", req.nextUrl.origin)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/candidate/:path*",
    "/admin/:path*",
    "/voter/:path*",
    "/super-admin/:path*",
  ],
};
