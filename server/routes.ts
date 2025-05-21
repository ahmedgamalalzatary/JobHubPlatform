import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertJobSchema, insertJobSourceSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Prefix all routes with /api
  
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user in session
      if (req.session) {
        req.session.userId = user.id;
      }
      
      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { username, password, email, firstName, lastName, preferredLanguage } = req.body;
      if (!username || !password || !email) {
        return res.status(400).json({ message: "Username, password, and email are required" });
      }
      
      // Check if username exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      // Check if email exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }
      
      const newUser = await storage.createUser({
        username,
        password,
        email,
        firstName,
        lastName,
        preferredLanguage: preferredLanguage || "en",
      });
      
      // Set user in session
      if (req.session) {
        req.session.userId = newUser.id;
      }
      
      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Get current user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Jobs routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const { page = "1", limit = "10", search, category, jobType, location, remote, salary, sortBy } = req.query;

      const filters = {
        search: search as string | undefined,
        category: category as string | undefined,
        jobType: jobType as string | undefined,
        location: location as string | undefined,
        remote: remote === "true" ? true : undefined,
        salary: salary as string | undefined,
        sortBy: sortBy as string | undefined,
      };

      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      const result = await storage.getJobs(filters, pageNumber, limitNumber);
      
      // Add isSaved field if user is authenticated
      if (req.session?.userId) {
        const savedJobs = await storage.getSavedJobsByUserId(req.session.userId);
        const savedJobIds = savedJobs.map(sj => sj.jobId);
        
        result.data = result.data.map(job => ({
          ...job,
          isSaved: savedJobIds.includes(job.id)
        }));
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("Get jobs error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const jobId = parseInt(req.params.id, 10);
      if (isNaN(jobId)) {
        return res.status(400).json({ message: "Invalid job ID" });
      }

      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Check if job is saved by the user
      let isSaved = false;
      if (req.session?.userId) {
        isSaved = await storage.isJobSavedByUser(req.session.userId, jobId);
      }

      return res.status(200).json({ ...job, isSaved });
    } catch (error) {
      console.error("Get job error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Saved Jobs routes
  app.get("/api/saved-jobs", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const { page = "1", limit = "10" } = req.query;
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      const result = await storage.getSavedJobs(req.session.userId, pageNumber, limitNumber);
      
      // Add isSaved field (always true for saved jobs)
      result.data = result.data.map(job => ({
        ...job,
        isSaved: true
      }));

      return res.status(200).json(result);
    } catch (error) {
      console.error("Get saved jobs error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/saved-jobs", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const { jobId } = req.body;
      if (!jobId) {
        return res.status(400).json({ message: "Job ID is required" });
      }

      // Check if job exists
      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Check if job is already saved
      const isAlreadySaved = await storage.isJobSavedByUser(req.session.userId, jobId);
      if (isAlreadySaved) {
        return res.status(409).json({ message: "Job already saved" });
      }

      const savedJob = await storage.saveJob(req.session.userId, jobId);
      return res.status(201).json(savedJob);
    } catch (error) {
      console.error("Save job error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/saved-jobs/:id", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const jobId = parseInt(req.params.id, 10);
      if (isNaN(jobId)) {
        return res.status(400).json({ message: "Invalid job ID" });
      }

      await storage.unsaveJob(req.session.userId, jobId);
      return res.status(204).end();
    } catch (error) {
      console.error("Unsave job error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Job Sources routes
  app.get("/api/job-sources", async (req, res) => {
    try {
      const { page = "1", limit = "10" } = req.query;
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      const result = await storage.getJobSources(pageNumber, limitNumber);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Get job sources error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/job-sources", async (req, res) => {
    try {
      // Validate request body using zod schema
      const jobSourceData = insertJobSourceSchema.parse(req.body);
      
      const jobSource = await storage.createJobSource(jobSourceData);
      return res.status(201).json(jobSource);
    } catch (error) {
      console.error("Create job source error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Notifications routes
  app.get("/api/notifications", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const notifications = await storage.getNotificationsByUserId(req.session.userId);
      return res.status(200).json(notifications);
    } catch (error) {
      console.error("Get notifications error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/notifications/count", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const count = await storage.getUnreadNotificationsCount(req.session.userId);
      return res.status(200).json(count);
    } catch (error) {
      console.error("Get notifications count error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const notificationId = parseInt(req.params.id, 10);
      if (isNaN(notificationId)) {
        return res.status(400).json({ message: "Invalid notification ID" });
      }

      // Check notification ownership
      const notification = await storage.getNotification(notificationId);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      if (notification.userId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized" });
      }

      await storage.markNotificationAsRead(notificationId);
      return res.status(204).end();
    } catch (error) {
      console.error("Mark notification as read error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Profile routes
  app.patch("/api/profile", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const { firstName, lastName, email, preferredLanguage } = req.body;
      
      // Check if email is already used by another user
      if (email) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser && existingUser.id !== req.session.userId) {
          return res.status(409).json({ message: "Email already exists" });
        }
      }

      const updatedUser = await storage.updateUser(req.session.userId, {
        firstName,
        lastName,
        email,
        preferredLanguage,
      });

      const { password, ...userWithoutPassword } = updatedUser;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Update profile error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  
  // Set up Express session middleware before returning the server
  app.use((req, res, next) => {
    if (!req.session) {
      req.session = {} as any;
    }
    next();
  });

  return httpServer;
}
