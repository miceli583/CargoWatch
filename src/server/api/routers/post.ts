import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { incidents } from "~/server/db/schema";
import { desc } from "drizzle-orm";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getLatestIncident: publicProcedure.query(async ({ ctx }) => {
    const incident = await ctx.db.query.incidents.findFirst({
      orderBy: desc(incidents.createdAt),
    });

    return incident ?? null;
  }),
});
