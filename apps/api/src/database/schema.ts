import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  activeOrganizationId: text("active_organization_id"),
});

export const accountTable = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verificationTable = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const workspaceTable = pgTable("workspace", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
  description: text("description"),
});

export const workspaceUserTable = pgTable("workspace_member", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaceTable.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  role: text("role").default("member").notNull(),
  createdAt: timestamp("created_at").notNull(),
  status: text("status"),
});

export const invitationTable = pgTable("invitation", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaceTable.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").default("pending").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const projectTable = pgTable("project", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaceTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  slug: text("slug").notNull(),
  icon: text("icon").default("Layout"),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  isPublic: boolean("is_public").default(false),
});

export const taskTable = pgTable("task", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projectTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  position: integer("position").default(0),
  number: integer("number").default(1),
  userEmail: text("assignee_email").references(() => userTable.email, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("to-do"),
  priority: text("priority").default("low"),
  dueDate: timestamp("due_date", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const timeEntryTable = pgTable("time_entry", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  taskId: text("task_id")
    .notNull()
    .references(() => taskTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  userEmail: text("user_email").references(() => userTable.email, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  description: text("description"),
  startTime: timestamp("start_time", { mode: "date" }).notNull(),
  endTime: timestamp("end_time", { mode: "date" }),
  duration: integer("duration").default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const activityTable = pgTable("activity", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  taskId: text("task_id")
    .notNull()
    .references(() => taskTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  type: text("type").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  userEmail: text("user_email")
    .notNull()
    .references(() => userTable.email, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  content: text("content"),
});

export const labelTable = pgTable("label", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  taskId: text("task_id")
    .notNull()
    .references(() => taskTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const notificationTable = pgTable("notification", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userEmail: text("user_email")
    .notNull()
    .references(() => userTable.email, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  title: text("title").notNull(),
  content: text("content"),
  type: text("type").notNull().default("info"),
  isRead: boolean("is_read").default(false),
  resourceId: text("resource_id"),
  resourceType: text("resource_type"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const githubIntegrationTable = pgTable("github_integration", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projectTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .unique(),
  repositoryOwner: text("repository_owner").notNull(),
  repositoryName: text("repository_name").notNull(),
  installationId: integer("installation_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
