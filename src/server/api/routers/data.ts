import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

import { z } from 'zod'

export const dataRouter = createTRPCRouter({
  getAll: protectedProcedure.query(
    async ({ ctx }) =>
      await ctx.prisma.data.findMany({ where: { userId: ctx.session.user.id } })
  ),
  add: protectedProcedure
    .input(
      z.object({
        glucoseAmount: z.number(),
        insulinDosage: z.number().nullable(),
        weight: z.number().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.data.create({
        data: {
          glucoseAmount: input.glucoseAmount,
          insulinDosage: input.insulinDosage,
          weight: input.weight,
          userId: ctx.session.user.id,
        },
      })
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        glucoseAmount: z.number(),
        insulinDosage: z.number().nullable(),
        weight: z.number().nullable(),
      })
    )
    .query(
      async ({ ctx, input }) =>
        await ctx.prisma.data.update({
          where: { id: input.id },
          data: {
            glucoseAmount: input.glucoseAmount,
            insulinDosage: input.insulinDosage,
            weight: input.weight,
          },
        })
    ),
})
