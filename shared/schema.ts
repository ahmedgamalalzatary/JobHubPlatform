import { pgTable, text, serial, integer, boolean, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatar: text("avatar"),
  preferredLanguage: text("preferred_language").default("en"),
});

// Jobs table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  location: text("location"),
  country: text("country"),
  jobType: text("job_type"), // full-time, part-time, contract, freelance
  salary: text("salary"),
  remote: boolean("remote").default(false),
  url: text("url").notNull(),
  source: text("source").notNull(),
  sourceId: text("source_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  category: text("category"),
});

// SavedJobs table - relation table between users and jobs they saved
export const savedJobs = pgTable("saved_jobs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  jobId: integer("job_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// JobSources table - for user-submitted job sources
export const jobSources = pgTable("job_sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  submitterEmail: text("submitter_email"),
  approved: boolean("approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  preferredLanguage: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
});

export const insertSavedJobSchema = createInsertSchema(savedJobs).omit({
  id: true,
  createdAt: true,
});

export const insertJobSourceSchema = createInsertSchema(jobSources).omit({
  id: true,
  approved: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  read: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type SavedJob = typeof savedJobs.$inferSelect;
export type InsertSavedJob = z.infer<typeof insertSavedJobSchema>;

export type JobSource = typeof jobSources.$inferSelect;
export type InsertJobSource = z.infer<typeof insertJobSourceSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
