import { z } from 'zod';
import { insertResponseSchema, valentineResponses } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  valentine: {
    respond: {
      method: 'POST' as const,
      path: '/api/valentine/respond' as const,
      input: insertResponseSchema,
      responses: {
        201: z.custom<typeof valentineResponses.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    getStatus: {
      method: 'GET' as const,
      path: '/api/valentine/status' as const,
      responses: {
        200: z.array(z.custom<typeof valentineResponses.$inferSelect>()),
      },
    },
  },
};

// ============================================
// TYPE HELPERS
// ============================================
export type ResponseInput = z.infer<typeof api.valentine.respond.input>;
export type ResponseResult = z.infer<typeof api.valentine.respond.responses[201]>;
