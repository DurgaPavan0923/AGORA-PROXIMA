module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/client/app/api/auth/register/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/server.js [app-route] (ecmascript)");
;
async function POST(request) {
    try {
        const formData = await request.formData();
        // Extract form fields
        const name = formData.get("name");
        const email = formData.get("email");
        const phoneNumber = formData.get("phoneNumber");
        const age = formData.get("age");
        const address = formData.get("address");
        const aadhaarNumber = formData.get("aadhaarNumber");
        const voterIdNumber = formData.get("voterIdNumber");
        const aadhaarCard = formData.get("aadhaarCard");
        const voterIdCard = formData.get("voterIdCard");
        // Validate required fields
        if (!name || !email || !phoneNumber || !age || !address || !aadhaarNumber || !voterIdNumber) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "All fields are required"
            }, {
                status: 400
            });
        }
        if (!aadhaarCard || !voterIdCard) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Both Aadhaar and Voter ID documents are required"
            }, {
                status: 400
            });
        }
        // Create FormData to send to backend
        const backendFormData = new FormData();
        backendFormData.append("fullName", name);
        backendFormData.append("email", email);
        backendFormData.append("phone", phoneNumber);
        backendFormData.append("age", age);
        backendFormData.append("address", address);
        backendFormData.append("aadhaar", aadhaarNumber);
        backendFormData.append("voterId", voterIdNumber);
        backendFormData.append("aadhaarCard", aadhaarCard);
        backendFormData.append("voterIdCard", voterIdCard);
        // Forward to backend API
        const backendUrl = ("TURBOPACK compile-time value", "http://localhost:5000/api") || "http://localhost:5000/api";
        const response = await fetch(`${backendUrl}/auth/register`, {
            method: "POST",
            body: backendFormData
        });
        const data = await response.json();
        if (!response.ok) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: data.error || data.message || "Registration failed"
            }, {
                status: response.status
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: data.message || "Registration submitted successfully",
            userId: data.userId
        }, {
            status: 200
        });
    } catch (error) {
        console.error("Registration API error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: error.message || "Internal server error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ad4ba027._.js.map