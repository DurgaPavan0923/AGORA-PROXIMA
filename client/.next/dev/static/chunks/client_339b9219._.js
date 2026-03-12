(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/client/lib/mock-db.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Mock database for development/hackathon
__turbopack_context__.s([
    "MockDatabase",
    ()=>MockDatabase,
    "mockDb",
    ()=>mockDb
]);
class MockDatabase {
    users = new Map();
    elections = new Map();
    votes = new Map();
    pendingUsers = new Map();
    otpRecords = new Map();
    mpinMap = new Map() // uniqueId -> MPIN
    ;
    userSessions = new Map();
    idProofs = new Map();
    // Users
    createUser(user) {
        this.users.set(user.id, user);
        return user;
    }
    getUser(id) {
        return this.users.get(id) || null;
    }
    updateUser(id, updates) {
        const user = this.users.get(id);
        if (!user) return null;
        const updated = {
            ...user,
            ...updates
        };
        this.users.set(id, updated);
        return updated;
    }
    // Elections
    createElection(election) {
        this.elections.set(election.id, election);
        return election;
    }
    getElection(id) {
        return this.elections.get(id) || null;
    }
    getAllElections() {
        return Array.from(this.elections.values());
    }
    updateElection(id, updates) {
        const election = this.elections.get(id);
        if (!election) return null;
        const updated = {
            ...election,
            ...updates
        };
        this.elections.set(id, updated);
        return updated;
    }
    // Votes
    addVote(vote) {
        this.votes.set(vote.id, vote);
        return vote;
    }
    getVotesByElection(electionId) {
        return Array.from(this.votes.values()).filter((v)=>v.electionId === electionId);
    }
    // ID Proofs
    issueIdProof(uniqueIdProof, user) {
        this.idProofs.set(uniqueIdProof, {
            user,
            issued: new Date()
        });
    }
    verifyIdProof(uniqueIdProof) {
        const proof = this.idProofs.get(uniqueIdProof);
        return proof ? proof.user : null;
    }
    // Pending User Management
    createPendingUser(pendingUser) {
        this.pendingUsers.set(pendingUser.id, pendingUser);
        return pendingUser;
    }
    getPendingUser(id) {
        return this.pendingUsers.get(id) || null;
    }
    getAllPendingUsers() {
        return Array.from(this.pendingUsers.values());
    }
    verifyPendingUser(id, uniqueId) {
        const user = this.pendingUsers.get(id);
        if (!user) return null;
        const verified = {
            ...user,
            status: "verified",
            uniqueId,
            verifiedAt: new Date()
        };
        this.pendingUsers.set(id, verified);
        return verified;
    }
    rejectPendingUser(id) {
        const user = this.pendingUsers.get(id);
        if (!user) return null;
        const rejected = {
            ...user,
            status: "rejected"
        };
        this.pendingUsers.set(id, rejected);
        return rejected;
    }
    // OTP Management
    generateOTP(phone) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.otpRecords.set(phone, {
            phone,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            attempts: 0
        });
        return otp;
    }
    verifyOTP(phone, otp) {
        const record = this.otpRecords.get(phone);
        if (!record) return false;
        if (record.expiresAt < new Date()) return false;
        if (record.attempts >= 3) return false;
        if (record.otp !== otp) {
            record.attempts++;
            record.lastAttempt = new Date();
            return false;
        }
        return true;
    }
    // MPIN Management
    // WARNING: Mock-only — plaintext storage. Production uses bcrypt via server authController.
    setMPIN(uniqueId, mpin) {
        this.mpinMap.set(uniqueId, mpin);
    }
    verifyMPIN(uniqueId, mpin) {
        return this.mpinMap.get(uniqueId) === mpin;
    }
    // Session Management
    createSession(uniqueId, role) {
        const sessionToken = `session-${Math.random().toString(36).substr(2, 20)}`;
        this.userSessions.set(sessionToken, {
            uniqueId,
            role,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
        return sessionToken;
    }
    getSession(token) {
        const session = this.userSessions.get(token);
        if (!session || session.expiresAt < new Date()) return null;
        return {
            uniqueId: session.uniqueId,
            role: session.role
        };
    }
    getUserByUniqueId(uniqueId) {
        for (const user of this.users.values()){
            if (user.uniqueId === uniqueId) return user;
        }
        return null;
    }
}
const mockDb = new MockDatabase();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/lib/init-test-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initializeTestData",
    ()=>initializeTestData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/client/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$lib$2f$mock$2d$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/lib/mock-db.ts [app-client] (ecmascript)");
;
function initializeTestData() {
    // Test Admin User
    const adminUser = {
        id: "admin-001",
        uniqueIdProof: "ADMIN-AGR-001",
        uniqueId: "ADMIN-AGR-001",
        role: "admin",
        email: "admin@agora.gov.in",
        name: "Admin User",
        phone: "8888888001",
        aadhaar: "888888888801",
        createdAt: new Date(),
        lastLogin: new Date()
    };
    // Test Election Commission User
    const ecUser = {
        id: "ec-001",
        uniqueIdProof: "EC-AGR-001",
        uniqueId: "EC-AGR-001",
        role: "election_commission",
        email: "ec@agora.gov.in",
        name: "Election Commission",
        phone: "7777777001",
        aadhaar: "777777777701",
        createdAt: new Date(),
        lastLogin: new Date()
    };
    // Test Regular User
    const regularUser = {
        id: "user-001",
        uniqueIdProof: "AGR-USER-001",
        uniqueId: "AGR-USER-001",
        role: "user",
        email: "citizen@agora.gov.in",
        name: "Test Citizen",
        phone: "9999999999",
        aadhaar: "999999999999",
        createdAt: new Date(),
        lastLogin: new Date()
    };
    // Create users in mock database
    __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$lib$2f$mock$2d$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockDb"].createUser(adminUser);
    __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$lib$2f$mock$2d$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockDb"].createUser(ecUser);
    __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$lib$2f$mock$2d$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockDb"].createUser(regularUser);
    // Set MPINs (4-digit)
    __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$lib$2f$mock$2d$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockDb"].setMPIN(adminUser.uniqueIdProof, "1234"); // Admin MPIN
    __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$lib$2f$mock$2d$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockDb"].setMPIN(ecUser.uniqueIdProof, "1234"); // EC MPIN
    __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$lib$2f$mock$2d$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockDb"].setMPIN(regularUser.uniqueIdProof, "1234"); // User MPIN
    console.log("✅ Test data initialized successfully!");
    console.log("\n🔑 Test Credentials:\n");
    console.log("1️⃣ ADMIN USER:");
    console.log("   Unique ID: ADMIN-AGR-001");
    console.log("   Phone: 8888888001");
    console.log("   MPIN: 1234");
    console.log("   Role: Admin\n");
    console.log("2️⃣ ELECTION COMMISSION USER:");
    console.log("   Unique ID: EC-AGR-001");
    console.log("   Phone: 7777777001");
    console.log("   MPIN: 1234");
    console.log("   Role: Election Commission\n");
    console.log("3️⃣ REGULAR CITIZEN USER:");
    console.log("   Unique ID: AGR-USER-001");
    console.log("   Phone: 9999999999");
    console.log("   MPIN: 1234");
    console.log("   Role: User\n");
    return {
        adminUser,
        ecUser,
        regularUser
    };
}
// Auto-initialize on import in development
if ("TURBOPACK compile-time truthy", 1) {
    initializeTestData();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/components/test-data-initializer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TestDataInitializer",
    ()=>TestDataInitializer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/client/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$lib$2f$init$2d$test$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/lib/init-test-data.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function TestDataInitializer() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TestDataInitializer.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$lib$2f$init$2d$test$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeTestData"])();
            }
        }
    }["TestDataInitializer.useEffect"], []);
    return null;
}
_s(TestDataInitializer, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = TestDataInitializer;
var _c;
__turbopack_context__.k.register(_c, "TestDataInitializer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/client/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
"[project]/client/node_modules/@vercel/analytics/dist/next/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Analytics",
    ()=>Analytics2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/client/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// src/nextjs/index.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// src/nextjs/utils.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/navigation.js [app-client] (ecmascript)");
"use client";
;
;
// package.json
var name = "@vercel/analytics";
var version = "1.5.0";
// src/queue.ts
var initQueue = ()=>{
    if (window.va) return;
    window.va = function a(...params) {
        (window.vaq = window.vaq || []).push(params);
    };
};
// src/utils.ts
function isBrowser() {
    return typeof window !== "undefined";
}
function detectEnvironment() {
    try {
        const env = ("TURBOPACK compile-time value", "development");
        if ("TURBOPACK compile-time truthy", 1) {
            return "development";
        }
    } catch (e) {}
    return "production";
}
function setMode(mode = "auto") {
    if (mode === "auto") {
        window.vam = detectEnvironment();
        return;
    }
    window.vam = mode;
}
function getMode() {
    const mode = isBrowser() ? window.vam : detectEnvironment();
    return mode || "production";
}
function isDevelopment() {
    return getMode() === "development";
}
function computeRoute(pathname, pathParams) {
    if (!pathname || !pathParams) {
        return pathname;
    }
    let result = pathname;
    try {
        const entries = Object.entries(pathParams);
        for (const [key, value] of entries){
            if (!Array.isArray(value)) {
                const matcher = turnValueToRegExp(value);
                if (matcher.test(result)) {
                    result = result.replace(matcher, `/[${key}]`);
                }
            }
        }
        for (const [key, value] of entries){
            if (Array.isArray(value)) {
                const matcher = turnValueToRegExp(value.join("/"));
                if (matcher.test(result)) {
                    result = result.replace(matcher, `/[...${key}]`);
                }
            }
        }
        return result;
    } catch (e) {
        return pathname;
    }
}
function turnValueToRegExp(value) {
    return new RegExp(`/${escapeRegExp(value)}(?=[/?#]|$)`);
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function getScriptSrc(props) {
    if (props.scriptSrc) {
        return props.scriptSrc;
    }
    if (isDevelopment()) {
        return "https://va.vercel-scripts.com/v1/script.debug.js";
    }
    if (props.basePath) {
        return `${props.basePath}/insights/script.js`;
    }
    return "/_vercel/insights/script.js";
}
// src/generic.ts
function inject(props = {
    debug: true
}) {
    var _a;
    if (!isBrowser()) return;
    setMode(props.mode);
    initQueue();
    if (props.beforeSend) {
        (_a = window.va) == null ? void 0 : _a.call(window, "beforeSend", props.beforeSend);
    }
    const src = getScriptSrc(props);
    if (document.head.querySelector(`script[src*="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.dataset.sdkn = name + (props.framework ? `/${props.framework}` : "");
    script.dataset.sdkv = version;
    if (props.disableAutoTrack) {
        script.dataset.disableAutoTrack = "1";
    }
    if (props.endpoint) {
        script.dataset.endpoint = props.endpoint;
    } else if (props.basePath) {
        script.dataset.endpoint = `${props.basePath}/insights`;
    }
    if (props.dsn) {
        script.dataset.dsn = props.dsn;
    }
    script.onerror = ()=>{
        const errorMessage = isDevelopment() ? "Please check if any ad blockers are enabled and try again." : "Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.";
        console.log(`[Vercel Web Analytics] Failed to load script from ${src}. ${errorMessage}`);
    };
    if (isDevelopment() && props.debug === false) {
        script.dataset.debug = "false";
    }
    document.head.appendChild(script);
}
function pageview({ route, path }) {
    var _a;
    (_a = window.va) == null ? void 0 : _a.call(window, "pageview", {
        route,
        path
    });
}
// src/react/utils.ts
function getBasePath() {
    if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] === "undefined" || typeof __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env === "undefined") {
        return void 0;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.REACT_APP_VERCEL_OBSERVABILITY_BASEPATH;
}
// src/react/index.tsx
function Analytics(props) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Analytics.useEffect": ()=>{
            var _a;
            if (props.beforeSend) {
                (_a = window.va) == null ? void 0 : _a.call(window, "beforeSend", props.beforeSend);
            }
        }
    }["Analytics.useEffect"], [
        props.beforeSend
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Analytics.useEffect": ()=>{
            inject({
                framework: props.framework || "react",
                basePath: props.basePath ?? getBasePath(),
                ...props.route !== void 0 && {
                    disableAutoTrack: true
                },
                ...props
            });
        }
    }["Analytics.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Analytics.useEffect": ()=>{
            if (props.route && props.path) {
                pageview({
                    route: props.route,
                    path: props.path
                });
            }
        }
    }["Analytics.useEffect"], [
        props.route,
        props.path
    ]);
    return null;
}
;
var useRoute = ()=>{
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    if (!params) {
        return {
            route: null,
            path
        };
    }
    const finalParams = Object.keys(params).length ? params : Object.fromEntries(searchParams.entries());
    return {
        route: computeRoute(path, finalParams),
        path
    };
};
function getBasePath2() {
    if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] === "undefined" || typeof __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env === "undefined") {
        return void 0;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_VERCEL_OBSERVABILITY_BASEPATH;
}
// src/nextjs/index.tsx
function AnalyticsComponent(props) {
    const { route, path } = useRoute();
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(Analytics, {
        path,
        route,
        ...props,
        basePath: getBasePath2(),
        framework: "next"
    });
}
function Analytics2(props) {
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: null
    }, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(AnalyticsComponent, {
        ...props
    }));
}
;
 //# sourceMappingURL=index.mjs.map
}),
]);

//# sourceMappingURL=client_339b9219._.js.map