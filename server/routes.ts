import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertActivityLogSchema, insertCanteenEntrySchema, updateCanteenEntrySchema, insertUserSchema, updateUserSchema } from "@shared/schema";

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

// Middleware to check if user is authenticated
const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  
  const user = await storage.getUserById(req.session.userId);
  if (!user) {
    req.session.userId = undefined;
    return res.status(401).json({ error: "User not found" });
  }
  
  if (!user.isApproved) {
    return res.status(403).json({ error: "Account not approved by admin" });
  }
  
  next();
};

// Middleware to check if user is admin
const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  
  const user = await storage.getUserById(req.session.userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication API endpoints
  
  // POST /api/auth/register - create new user account
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      const user = await storage.createUser(validatedData);
      res.json({ 
        id: user.id, 
        username: user.username,
        isApproved: user.isApproved,
        isAdmin: user.isAdmin 
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });
  
  // POST /api/auth/login - login user
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      
      const user = await storage.validatePassword(username, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      
      if (!user.isApproved) {
        return res.status(403).json({ error: "Account pending admin approval" });
      }
      
      // Regenerate session to prevent session fixation attacks
      req.session.regenerate((err) => {
        if (err) {
          console.error("Error regenerating session:", err);
          return res.status(500).json({ error: "Failed to login" });
        }
        
        req.session.userId = user.id;
        res.json({ 
          id: user.id, 
          username: user.username,
          isApproved: user.isApproved,
          isAdmin: user.isAdmin 
        });
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });
  
  // POST /api/auth/logout - logout user
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });
  
  // GET /api/auth/me - get current user
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const user = await storage.getUserById(req.session.userId);
    if (!user) {
      req.session.userId = undefined;
      return res.status(401).json({ error: "User not found" });
    }
    
    res.json({ 
      id: user.id, 
      username: user.username,
      isApproved: user.isApproved,
      isAdmin: user.isAdmin 
    });
  });
  // Admin API endpoints
  
  // GET /api/admin/users - get all users (admin only)
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getUsers();
      // Don't send passwords to client
      const sanitizedUsers = users.map(({ password, ...user }) => user);
      res.json(sanitizedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });
  
  // PATCH /api/admin/users/:id - update user (admin only)
  app.patch("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateUserSchema.parse(req.body);
      const user = await storage.updateUser(id, validatedData);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { password, ...sanitizedUser } = user;
      res.json(sanitizedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });
  
  // DELETE /api/admin/users/:id - delete user (admin only)
  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Prevent deleting yourself
      if (id === req.session.userId) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }
      
      const success = await storage.deleteUser(id);
      if (!success) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Activity Logs API endpoints (protected)
  
  // GET /api/logs - fetch all activity logs (newest first)
  app.get("/api/logs", requireAuth, async (req, res) => {
    try {
      const logs = await storage.getActivityLogs();
      res.json(logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  // POST /api/logs - create new activity log
  app.post("/api/logs", requireAuth, async (req, res) => {
    try {
      const validatedData = insertActivityLogSchema.parse(req.body);
      const log = await storage.createActivityLog(validatedData);
      res.json(log);
    } catch (error) {
      console.error("Error creating log:", error);
      res.status(500).json({ error: "Failed to create log" });
    }
  });

  // Canteen Entries API endpoints (protected)
  
  // GET /api/entries - fetch all canteen entries (newest first)
  app.get("/api/entries", requireAuth, async (req, res) => {
    try {
      const entries = await storage.getCanteenEntries();
      console.log(`[DEBUG] Fetched ${entries.length} entries for user ${req.session.userId}`);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching entries:", error);
      res.status(500).json({ error: "Failed to fetch entries" });
    }
  });

  // POST /api/entries - create new canteen entry (no auth required - public form)
  app.post("/api/entries", async (req, res) => {
    try {
      console.log("[DEBUG] Received entry creation request:", req.body);
      const validatedData = insertCanteenEntrySchema.parse(req.body);
      const entry = await storage.createCanteenEntry(validatedData);
      console.log("[DEBUG] Created entry:", entry);
      res.json(entry);
    } catch (error) {
      console.error("Error creating entry:", error);
      res.status(500).json({ error: "Failed to create entry" });
    }
  });

  // PATCH /api/entries/:id - update canteen entry
  app.patch("/api/entries/:id", requireAuth, async (req, res) => {
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
