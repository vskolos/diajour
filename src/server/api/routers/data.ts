import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const dataRouter = createTRPCRouter({
  getAll: protectedProcedure.query(
    async ({ ctx }) =>
      await ctx.prisma.data.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { date: 'desc' },
      })
  ),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(
      async ({ ctx, input }) =>
        await ctx.prisma.data.findUnique({ where: { id: input.id } })
    ),

  add: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        timePeriod: z.enum(['morning', 'midday', 'evening']),
        glucoseAmount: z.number(),
        insulinDosage: z.number().nullable(),
        weight: z.number().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const entries = await ctx.prisma.data.findMany({
        where: { date: input.date, timePeriod: input.timePeriod },
      })

      if (entries.length > 0)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Данные за этот период уже добавлены',
        })

      await ctx.prisma.data.create({
        data: {
          date: input.date,
          timePeriod: input.timePeriod,
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
