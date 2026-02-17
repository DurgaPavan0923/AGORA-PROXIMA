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
"[project]/client/lib/mock-db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
    setMPIN(uniqueId, mpin) {
        // In production, encrypt the MPIN
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
}),
"[project]/client/app/api/elections/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Get all elections
__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$lib$2f$mock$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/lib/mock-db.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const elections = __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$lib$2f$mock$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mockDb"].getAllElections();
        return __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            elections: elections.map((e)=>({
                    ...e,
                    totalVotes: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$lib$2f$mock$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mockDb"].getVotesByElection(e.id).length
                }))
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch elections"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const token = request.headers.get("authorization")?.replace("Bearer ", "");
        if (!token) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const body = await request.json();
        const newElection = {
            id: `election-${Date.now()}`,
            title: body.title,
            description: body.description,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            status: "draft",
            parties: body.parties || [],
            createdBy: token,
            createdAt: new Date()
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$lib$2f$mock$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mockDb"].createElection(newElection);
        return __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            election: newElection
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to create election"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3c9d1d6e._.js.map