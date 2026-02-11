import { db } from "./db";
import {
  valentineResponses,
  type InsertValentineResponse,
  type ValentineResponse
} from "@shared/schema";

export interface IStorage {
  createResponse(response: InsertValentineResponse): Promise<ValentineResponse>;
  getResponses(): Promise<ValentineResponse[]>;
}

export class DatabaseStorage implements IStorage {
  async createResponse(insertResponse: InsertValentineResponse): Promise<ValentineResponse> {
    const [response] = await db
      .insert(valentineResponses)
      .values(insertResponse)
      .returning();
    return response;
  }

  async getResponses(): Promise<ValentineResponse[]> {
    return await db.select().from(valentineResponses);
  }
}

export const storage = new DatabaseStorage();
