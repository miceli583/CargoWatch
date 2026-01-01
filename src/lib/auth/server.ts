/**
 * Server-side Auth Utilities
 * Protection helpers for routes and server components
 */

import { redirect } from "next/navigation";
import { createClient } from "~/lib/supabase/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { User } from "~/server/db/schema";

/**
 * Get the currently authenticated user from the database
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  // Fetch user from database with all approval info
  const dbUser = await db.query.users.findFirst({
    where: eq(users.authId, authUser.id),
  });

  return dbUser ?? null;
}

/**
 * Require authentication - redirects to login if not authenticated
 * Use this for pages that require any authenticated user
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  return user;
}

/**
 * Require approved user - redirects based on status
 * Use this for protected features that require approval
 */
export async function requireApprovedUser(): Promise<User> {
  const user = await requireAuth();

  // Check if user has not verified their email
  if (!user.emailVerified) {
    redirect("/verify-email");
  }

  // Check if user is pending approval
  if (user.approvalStatus === "pending") {
    redirect("/pending-approval");
  }

  // Check if user was rejected
  if (user.approvalStatus === "rejected") {
    redirect("/pending-approval"); // Shows rejection reason
  }

  // Check if account is suspended or deactivated
  if (user.accountStatus !== "active") {
    redirect("/account-suspended");
  }

  return user;
}

/**
 * Require specific role(s) - redirects if user doesn't have required role
 * Automatically checks for approval as well
 */
export async function requireRole(allowedRoles: string[]): Promise<User> {
  const user = await requireApprovedUser();

  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }

  return user;
}

/**
 * Check if current user is admin
 * Returns boolean, doesn't redirect
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "admin";
}

/**
 * Check if current user is approved
 * Returns boolean, doesn't redirect
 */
export async function isApproved(): Promise<boolean> {
  const user = await getCurrentUser();
  return (
    user !== null &&
    user.approvalStatus === "approved" &&
    user.accountStatus === "active"
  );
}
