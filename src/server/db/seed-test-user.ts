/**
 * Seed Test User
 * Creates an approved test user for immediate login
 */

import { createClient } from "@supabase/supabase-js";
import { db } from "./index";
import { users } from "./schema";
import { env } from "~/env";

const TEST_USER = {
  email: "test@cargowatch.com",
  password: "TestUser123!",
  fullName: "Test User",
  company: "CargoWatch Demo",
  role: "admin" as const,
  phoneNumber: "(555) 123-4567",
  companyRole: "Platform Administrator",
};

async function seedTestUser() {
  console.log("🌱 Seeding test user...");

  try {
    // Create Supabase admin client with service role key
    const supabase = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 1. Create user in Supabase Auth
    console.log("Creating Supabase Auth user...");
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: TEST_USER.email,
        password: TEST_USER.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: TEST_USER.fullName,
        },
      });

    if (authError) {
      // Check if user already exists
      if (authError.message.includes("already registered")) {
        console.log("⚠️  User already exists in Supabase Auth");

        // Try to get existing user
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers.users.find(
          (u) => u.email === TEST_USER.email
        );

        if (!existingUser) {
          throw new Error("User exists but could not be found");
        }

        console.log("✅ Found existing auth user:", existingUser.id);

        // Check if database user exists
        const existingDbUser = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.authId, existingUser.id),
        });

        if (existingDbUser) {
          console.log("✅ Database user already exists");
          console.log("\n🎉 Test user is ready!");
          console.log("Email:", TEST_USER.email);
          console.log("Password:", TEST_USER.password);
          return;
        }

        // Create database user for existing auth user
        await db.insert(users).values({
          authId: existingUser.id,
          email: TEST_USER.email,
          fullName: TEST_USER.fullName,
          company: TEST_USER.company,
          role: TEST_USER.role,
          phoneNumber: TEST_USER.phoneNumber,
          companyRole: TEST_USER.companyRole,
          approvalStatus: "approved",
          accountStatus: "active",
          emailVerified: true,
          emailVerifiedAt: new Date(),
          termsAcceptedAt: new Date(),
        });

        console.log("✅ Created database user record");
        console.log("\n🎉 Test user is ready!");
        console.log("Email:", TEST_USER.email);
        console.log("Password:", TEST_USER.password);
        return;
      }

      throw authError;
    }

    if (!authData.user) {
      throw new Error("Failed to create auth user");
    }

    console.log("✅ Created Supabase Auth user:", authData.user.id);

    // 2. Create user record in database
    console.log("Creating database user record...");
    await db.insert(users).values({
      authId: authData.user.id,
      email: TEST_USER.email,
      fullName: TEST_USER.fullName,
      company: TEST_USER.company,
      role: TEST_USER.role,
      phoneNumber: TEST_USER.phoneNumber,
      companyRole: TEST_USER.companyRole,
      approvalStatus: "approved",
      accountStatus: "active",
      emailVerified: true,
      emailVerifiedAt: new Date(),
      termsAcceptedAt: new Date(),
    });

    console.log("✅ Created database user record");

    console.log("\n🎉 Test user created successfully!");
    console.log("━".repeat(50));
    console.log("Email:", TEST_USER.email);
    console.log("Password:", TEST_USER.password);
    console.log("Role:", TEST_USER.role);
    console.log("Status: Approved (ready to login)");
    console.log("━".repeat(50));
  } catch (error) {
    console.error("❌ Error seeding test user:", error);
    throw error;
  }
}

// Run the seed
seedTestUser()
  .then(() => {
    console.log("\n✨ Seed completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seed failed:", error);
    process.exit(1);
  });
