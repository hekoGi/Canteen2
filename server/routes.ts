import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertActivityLogSchema, insertCanteenEntrySchema, updateCanteenEntrySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Activity Logs API endpoints
  
  // GET /api/logs - fetch all activity logs (newest first)
  app.get("/api/logs", async (req, res) => {
    try {
      const logs = await storage.getActivityLogs();
      res.json(logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  // POST /api/logs - create new activity log
  app.post("/api/logs", async (req, res) => {
    try {
      const validatedData = insertActivityLogSchema.parse(req.body);
      const log = await storage.createActivityLog(validatedData);
      res.json(log);
    } catch (error) {
      console.error("Error creating log:", error);
      res.status(500).json({ error: "Failed to create log" });
    }
  });

  // Canteen Entries API endpoints
  
  // GET /api/entries - fetch all canteen entries (newest first)
  app.get("/api/entries", async (req, res) => {
    try {
      const entries = await storage.getCanteenEntries();
      res.json(entries);
    } catch (error) {
      console.error("Error fetching entries:", error);
      res.status(500).json({ error: "Failed to fetch entries" });
    }
  });

  // POST /api/entries - create new canteen entry
  app.post("/api/entries", async (req, res) => {
    try {
      const validatedData = insertCanteenEntrySchema.parse(req.body);
      const entry = await storage.createCanteenEntry(validatedData);
      res.json(entry);
    } catch (error) {
      console.error("Error creating entry:", error);
      res.status(500).json({ error: "Failed to create entry" });
    }
  });

  // PATCH /api/entries/:id - update canteen entry
  app.patch("/api/entries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateCanteenEntrySchema.parse(req.body);
      const entry = await storage.updateCanteenEntry(id, validatedData);
      
      if (!entry) {
        return res.status(404).json({ error: "Entry not found" });
      }
      
      res.json(entry);
    } catch (error) {
      console.error("Error updating entry:", error);
      res.status(500).json({ error: "Failed to update entry" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
