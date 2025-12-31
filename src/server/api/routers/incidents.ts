import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { incidents } from "~/server/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export const incidentsRouter = createTRPCRouter({
  /**
   * Get all incidents with optional filtering
   */
  getAll: publicProcedure
    .input(
      z
        .object({
          region: z.string().optional(),
          severity: z.string().optional(),
          type: z.string().optional(),
          limit: z.number().min(1).max(500).optional().default(200),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const filters = [];

      if (input?.region && input.region !== "all") {
        filters.push(eq(incidents.region, input.region));
      }

      if (input?.severity && input.severity !== "all") {
        filters.push(eq(incidents.severityLevel, input.severity));
      }

      if (input?.type && input.type !== "all") {
        filters.push(eq(incidents.incidentType, input.type));
      }

      const allIncidents = await ctx.db.query.incidents.findMany({
        where: filters.length > 0 ? sql`${sql.join(filters, sql` AND `)}` : undefined,
        orderBy: desc(incidents.createdAt),
        limit: input?.limit ?? 200,
      });

      return allIncidents;
    }),

  /**
   * Get a single incident by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const incident = await ctx.db.query.incidents.findFirst({
        where: eq(incidents.id, input.id),
      });

      return incident ?? null;
    }),

  /**
   * Create a new incident report
   */
  create: publicProcedure
    .input(
      z.object({
        // Required fields
        incidentType: z.string().min(1, "Incident type is required"),
        severityLevel: z.string().min(1, "Severity level is required"),
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        region: z.string().min(1, "Region is required"),
        specificLocation: z.string().min(1, "Specific location is required"),
        incidentDate: z.date(),
        reporterName: z.string().min(1, "Your name is required"),
        reporterContact: z.string().min(1, "Contact information is required"),

        // Optional fields
        cargoType: z.string().optional(),
        incidentTime: z.string().optional(),
        estimatedLoss: z.number().optional(),
        reporterCompany: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),

        // Reporter ID - for now we'll use a demo user, later this will come from auth
        reporterId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // For now, use the first demo user if no reporterId is provided
      // In production, this would come from the authenticated session
      let reporterId = input.reporterId;

      if (!reporterId) {
        const demoUser = await ctx.db.query.users.findFirst();
        if (!demoUser) {
          throw new Error("No users found in database. Please run seed script.");
        }
        reporterId = demoUser.id;
      }

      // Create the incident
      const [newIncident] = await ctx.db
        .insert(incidents)
        .values({
          reporterId,
          incidentType: input.incidentType,
          severityLevel: input.severityLevel,
          title: input.title,
          description: input.description,
          region: input.region,
          specificLocation: input.specificLocation,
          incidentDate: input.incidentDate,
          incidentTime: input.incidentTime,
          cargoType: input.cargoType,
          estimatedLoss: input.estimatedLoss ? input.estimatedLoss.toString() : null,
          reporterName: input.reporterName,
          reporterCompany: input.reporterCompany,
          reporterContact: input.reporterContact,
          latitude: input.latitude,
          longitude: input.longitude,
          status: "active",
        })
        .returning();

      return newIncident;
    }),
});
