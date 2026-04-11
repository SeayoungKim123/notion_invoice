import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";

const isDev = process.env.NODE_ENV === "development";

export function middleware(request: NextRequest) {
  const nonce = crypto.randomBytes(16).toString("base64");

  const scriptSrc = isDev
    ? `'self' 'nonce-${nonce}' 'unsafe-eval'`
    : `'self' 'nonce-${nonce}'`;

  const csp = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://covers.openlibrary.org https://contents.kyobobook.co.kr https://prod-files-secure.s3.us-west-2.amazonaws.com https://*.amazonaws.com",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  const response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("x-nonce", nonce);

  return response;
}

export const config = {
  matcher: [
    /*
     * 정적 파일(_next/static, _next/image, favicon 등)은 제외하고
     * 모든 경로에 미들웨어 적용
     */
    {
      source: "/((?!_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
