import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createConsultationRequest, createContactEnquiry } from "./db";

const emailSchema = z.string().trim().email().max(320);
const phoneSchema = z
  .string()
  .trim()
  .min(7)
  .max(40)
  .regex(/^[+()\-\s\d]+$/, "Enter a valid phone number");

const leadProtectionSchema = z.object({
  website: z.string().max(0).optional().default(""),
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  leads: router({
    createConsultation: publicProcedure
      .input(
        leadProtectionSchema.extend({
          name: z.string().trim().min(2).max(120),
          email: emailSchema,
          phone: phoneSchema,
          visaType: z.string().trim().min(2).max(80),
          preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          preferredTime: z.string().trim().min(2).max(40),
          message: z.string().trim().max(2000).optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const { website: _honeypot, ...lead } = input;
        const result = await createConsultationRequest(lead);
        return {
          success: true,
          requestId: result.id,
          message: "Your consultation request has been received.",
        } as const;
      }),
    createEnquiry: publicProcedure
      .input(
        leadProtectionSchema.extend({
          name: z.string().trim().min(2).max(120),
          email: emailSchema,
          phone: phoneSchema.optional().or(z.literal("")),
          subject: z.string().trim().min(3).max(160),
          message: z.string().trim().min(10).max(2500),
        }),
      )
      .mutation(async ({ input }) => {
        const { website: _honeypot, ...enquiry } = input;
        const result = await createContactEnquiry({
          ...enquiry,
          phone: enquiry.phone || null,
        });
        return {
          success: true,
          enquiryId: result.id,
          message: "Thank you. Your enquiry is now with our team.",
        } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
