import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.valentine.respond.path, async (req, res) => {
    try {
      const input = api.valentine.respond.input.parse(req.body);
      const result = await storage.createResponse(input);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.valentine.getStatus.path, async (req, res) => {
    const responses = await storage.getResponses();
    res.json(responses);
  });

  return httpServer;
}
