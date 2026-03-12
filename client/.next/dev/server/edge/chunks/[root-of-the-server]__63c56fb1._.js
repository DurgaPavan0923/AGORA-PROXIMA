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
    voter: [
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
    "/",
    "/api"
];
/** Decode JWT payload without verification (verification happens server-side) */ function decodeJWTPayload(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch  {
        return null;
    }
}
function middleware(request) {
    const { pathname } = request.nextUrl;
    const authToken = request.cookies.get("auth-token")?.value;
    // Allow public routes
    if (publicRoutes.some((route)=>pathname === route || route !== "/" && pathname.startsWith(route))) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    if (!authToken) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/auth", request.url));
    }
    // Decode token to extract role
    const payload = decodeJWTPayload(authToken);
    if (!payload || !payload.role) {
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/auth", request.url));
        response.cookies.delete("auth-token");
        return response;
    }
    // Enforce role-based access for dashboard routes
    if (pathname.startsWith("/dashboard")) {
        const userRole = payload.role;
        const allowedPaths = roleRoutes[userRole] || [];
        const hasAccess = allowedPaths.some((path)=>pathname.startsWith(path));
        if (!hasAccess) {
            const correctPath = roleRoutes[userRole]?.[0] || "/auth";
            return __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(correctPath, request.url));
        }
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