(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__63c56fb1._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/client/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Role-based access control middleware
__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
const roleRoutes = {
    user: [
        "/dashboard/user"
    ],
    admin: [
        "/dashboard/admin"
    ],
    election_commission: [
        "/dashboard/election-commission"
    ]
};
const publicRoutes = [
    "/auth",
    "/"
];
function middleware(request) {
    const { pathname } = request.nextUrl;
    const authToken = request.cookies.get("auth-token")?.value;
    if (publicRoutes.some((route)=>pathname.startsWith(route))) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    if (!authToken) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/auth", request.url));
    }
    // For this implementation, we'll check the requested route
    const requestedDashboard = pathname.split("/")[2] // Extract 'user', 'admin', or 'election-commission'
    ;
    if (pathname.startsWith("/dashboard")) {
    // In production, verify token and check if user role matches the requested dashboard
    // For now, we allow access (authentication is enforced)
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        "/((?!_next|.*\\..*|public).*)"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__63c56fb1._.js.map