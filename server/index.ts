import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { registerRoutes } from "./routes";
import { storage } from "./storage";
import { pool } from "./db";
import fs from "fs";
import path from "path";

const PgStore = pgSession(session);

function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

function serveStatic(app: any) {
  const distPath = path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req: any, res: any) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// Validate required environment variables
if (!process.env.SESSION_SECRET) {
  console.warn("WARNING: SESSION_SECRET not set. Using a default value for development only.");
  console.warn("For production, set SESSION_SECRET environment variable to a random secret.");
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET environment variable is required in production");
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    store: new PgStore({
      pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "dev-secret-change-this-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      // Allow insecure cookies in production when running locally in Docker
      secure: false, // process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Initialize default admin user
async function initializeAdminUser() {
  try {
    const adminUsername = "admin";
    const adminPassword = "W5hoSxQFLC#P&o!3fG$s";
    
    const existingAdmin = await storage.getUserByUsername(adminUsername);
    
    if (!existingAdmin) {
      await storage.createAdminUser({
        username: adminUsername,
        password: adminPassword,
        isApproved: true,
        isAdmin: true,
      });
      log("✓ Default admin user created (username: admin)");
    } else {
      // Ensure existing admin user is approved and has admin privileges
      if (!existingAdmin.isApproved || !existingAdmin.isAdmin) {
        await storage.updateUser(existingAdmin.id, {
          isApproved: true,
          isAdmin: true,
        });
        log("✓ Admin user status updated");
      }
    }
  } catch (error) {
    console.error("Failed to initialize admin user:", error);
  }
}

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Initialize admin user before starting the server
  await initializeAdminUser();

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
