import { NextRequest, NextResponse } from "next/server";

// This function can be used with async if using await inside

// This is the first part of the middleware which contains the logic of the middleware
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // login and signup paths are public, can be reached by anyone, we have to check it bcoz we don't want to handle the cookie and all those things on the public route
    const isPublicPath =
        path === "/login" || path === "/signup" || path === "/verifyemail";

    const token = request.cookies.get("token")?.value || "";

    // If someone is not on publicpath and have token, then he should not be there, he should be redirected
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
}

// This is the matching part of the middleware to decide on which route we want to run our middleware
export const config = {
    matcher: [
        "/",
        "/profile",
        "/profile/:path*",
        "/login",
        "/signup",
        "/verifyemail",
    ],
};
