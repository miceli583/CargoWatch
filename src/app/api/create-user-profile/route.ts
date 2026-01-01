/**
 * API Route: Create User Profile
 * Creates a user record in the database after Supabase Auth signup
 */

import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      authId,
      email,
      fullName,
      phoneNumber,
      company,
      role,
      companyRole,
      mcNumber,
      dotNumber,
      badgeNumber,
      department,
      approvalStatus,
      accountStatus,
      emailVerified,
      termsAcceptedAt,
    } = body;

    // Validate required fields
    if (!authId || !email || !fullName || !company || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create user record
    const [newUser] = await db
      .insert(users)
      .values({
        authId,
        email,
        fullName,
        phoneNumber,
        company,
        role,
        companyRole,
        mcNumber,
        dotNumber,
        badgeNumber,
        department,
        approvalStatus: approvalStatus ?? "pending",
        accountStatus: accountStatus ?? "active",
        emailVerified: emailVerified ?? false,
        termsAcceptedAt: termsAcceptedAt ? new Date(termsAcceptedAt) : new Date(),
      })
      .returning();

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating user profile:", error);
    return NextResponse.json(
      { error: "Failed to create user profile" },
      { status: 500 }
    );
  }
}
