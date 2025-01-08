import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const basicAuth = request.headers.get("authorization");

  if (!basicAuth) {
    return new NextResponse(null, {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });
  }

  const authValue = basicAuth.split(" ")[1];
  const [user, pwd] = atob(authValue).split(":");

  if (
    user !== process.env.ADMIN_USERNAME ||
    pwd !== process.env.ADMIN_PASSWORD
  ) {
    return new NextResponse(null, {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
