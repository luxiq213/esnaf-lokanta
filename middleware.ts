import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Admin paneli ve admin API endpoint'leri için kontrol
  const isAdminPath =
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/api/admin");
  if (isAdminPath) {
    const role = request.cookies.get("role")?.value;
    if (role !== "admin") {
      // API isteği ise JSON, sayfa isteği ise yönlendirme
      if (request.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 403 });
      } else {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}; 