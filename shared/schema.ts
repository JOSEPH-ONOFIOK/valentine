import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const valentineResponses = pgTable("valentine_responses", {
  id: serial("id").primaryKey(),
  responderName: text("responder_name").default("My Valentine"),
  accepted: boolean("accepted").notNull(),
  message: text("message"), // Optional message back
  createdAt: timestamp("created_at").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertResponseSchema = createInsertSchema(valentineResponses).omit({ 
  id: true, 
  createdAt: true 
});

// === EXPLICIT API CONTRACT TYPES ===
export type ValentineResponse = typeof valentineResponses.$inferSelect;
export type InsertValentineResponse = z.infer<typeof insertResponseSchema>;

// Request types
export type CreateResponseRequest = InsertValentineResponse;

// Response types
export type ValentineResponseResult = ValentineResponse;
