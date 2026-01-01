/**
 * Auth Router
 * Handles user authentication, profile management, and account operations
 */

import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const authRouter = createTRPCRouter({
  /**
   * Get current authenticated user
   * Public procedure that returns null if not authenticated
   */
  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    return ctx.user ?? null;
  }),

  /**
   * Update user profile
   * Protected procedure - requires authentication
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        fullName: z.string().min(1).max(255).optional(),
        phoneNumber: z.string().max(50).optional(),
        company: z.string().max(255).optional(),
        companyRole: z.string().max(100).optional(),
        bio: z.string().optional(),
        avatarUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(users)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.user.id))
        .returning();

      return updated;
    }),

  /**
   * Update notification preferences
   * Protected procedure - requires authentication
   */
  updateNotificationPreferences: protectedProcedure
    .input(
      z.object({
        notificationsEnabled: z.boolean().optional(),
        emailAlertsEnabled: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(users)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.user.id))
        .returning();

      return updated;
    }),

  /**
   * Update last login timestamp
   * Protected procedure - called when user logs in
   */
  updateLastLogin: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, ctx.user.id));

    return { success: true };
  }),

  /**
   * Get user approval status
   * Protected procedure - useful for checking if user can proceed
   */
  getApprovalStatus: protectedProcedure.query(async ({ ctx }) => {
    return {
      approvalStatus: ctx.user.approvalStatus,
      emailVerified: ctx.user.emailVerified,
      accountStatus: ctx.user.accountStatus,
      rejectionReason: ctx.user.rejectionReason,
      isApproved:
        ctx.user.approvalStatus === "approved" &&
        ctx.user.accountStatus === "active",
    };
  }),
});
