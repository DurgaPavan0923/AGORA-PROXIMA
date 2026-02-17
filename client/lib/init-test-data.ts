import { mockDb } from "./mock-db"
import type { User } from "./types"

/**
 * Initialize test admin user for development
 * This creates a verified admin user that can be used to test all features
 */
export function initializeTestData() {
  // Test Admin User
  const adminUser: User = {
    id: "admin-001",
    uniqueIdProof: "ADMIN-AGR-001",
    uniqueId: "ADMIN-AGR-001",
    role: "admin",
    email: "admin@agora.gov.in",
    name: "Admin User",
    phone: "8888888001",
    aadhaar: "888888888801",
    createdAt: new Date(),
    lastLogin: new Date(),
  }

  // Test Election Commission User
  const ecUser: User = {
    id: "ec-001",
    uniqueIdProof: "EC-AGR-001",
    uniqueId: "EC-AGR-001",
    role: "election_commission",
    email: "ec@agora.gov.in",
    name: "Election Commission",
    phone: "7777777001",
    aadhaar: "777777777701",
    createdAt: new Date(),
    lastLogin: new Date(),
  }

  // Test Regular User
  const regularUser: User = {
    id: "user-001",
    uniqueIdProof: "AGR-USER-001",
    uniqueId: "AGR-USER-001",
    role: "user",
    email: "citizen@agora.gov.in",
    name: "Test Citizen",
    phone: "9999999999",
    aadhaar: "999999999999",
    createdAt: new Date(),
    lastLogin: new Date(),
  }

  // Create users in mock database
  mockDb.createUser(adminUser)
  mockDb.createUser(ecUser)
  mockDb.createUser(regularUser)

  // Set MPINs (4-digit)
  mockDb.setMPIN(adminUser.uniqueIdProof, "1234") // Admin MPIN
  mockDb.setMPIN(ecUser.uniqueIdProof, "1234") // EC MPIN
  mockDb.setMPIN(regularUser.uniqueIdProof, "1234") // User MPIN

  console.log("✅ Test data initialized successfully!")
  console.log("\n🔑 Test Credentials:\n")
  console.log("1️⃣ ADMIN USER:")
  console.log("   Unique ID: ADMIN-AGR-001")
  console.log("   Phone: 8888888001")
  console.log("   MPIN: 1234")
  console.log("   Role: Admin\n")
  
  console.log("2️⃣ ELECTION COMMISSION USER:")
  console.log("   Unique ID: EC-AGR-001")
  console.log("   Phone: 7777777001")
  console.log("   MPIN: 1234")
  console.log("   Role: Election Commission\n")
  
  console.log("3️⃣ REGULAR CITIZEN USER:")
  console.log("   Unique ID: AGR-USER-001")
  console.log("   Phone: 9999999999")
  console.log("   MPIN: 1234")
  console.log("   Role: User\n")

  return { adminUser, ecUser, regularUser }
}

// Auto-initialize on import in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  initializeTestData()
}
