import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertActivityLogSchema } from "@shared/schema";

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

  const httpServer = createServer(app);

  return httpServer;
}
