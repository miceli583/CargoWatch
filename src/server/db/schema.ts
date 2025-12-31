/**
 * CargoWatch Database Schema
 *
 * A collaborative freight protection platform for reporting and tracking
 * cargo theft and suspicious activity across the US freight network.
 */

import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  varchar,
  text,
  timestamp,
  uuid,
  integer,
  decimal,
  boolean,
  jsonb,
  index
} from "drizzle-orm/pg-core";

/**
 * Multi-project schema support
 * Prefixes all tables with "cargowatch_"
 */
export const createTable = pgTableCreator((name) => `cargowatch_${name}`);

/**
 * Users & Authentication
 * Synced with Supabase Auth
 */
export const users = createTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Supabase auth ID for linking
    authId: uuid("auth_id").notNull().unique(),

    // Profile Information
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phoneNumber: varchar("phone_number", { length: 50 }),
    company: varchar("company", { length: 255 }),

    // User Role
    role: varchar("role", { length: 50 }).notNull().default("member"),
    // Roles: member, driver, security, law_enforcement, admin

    // Profile Settings
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    isVerified: boolean("is_verified").notNull().default(false),

    // Notifications
    notificationsEnabled: boolean("notifications_enabled").notNull().default(true),
    emailAlertsEnabled: boolean("email_alerts_enabled").notNull().default(true),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  },
  (table) => ({
    emailIdx: index("user_email_idx").on(table.email),
    authIdIdx: index("user_auth_id_idx").on(table.authId),
    roleIdx: index("user_role_idx").on(table.role),
  })
);

/**
 * Incident Reports
 * Core entity for cargo theft and suspicious activity
 */
export const incidents = createTable(
  "incident",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Reporter Information
    reporterId: uuid("reporter_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    // Incident Classification
    incidentType: varchar("incident_type", { length: 100 }).notNull(),
    // Types: theft, suspicious, tampering, attempted_break_in, etc.

    severityLevel: varchar("severity_level", { length: 50 }).notNull(),
    // Levels: critical, high, medium, low

    cargoType: varchar("cargo_type", { length: 100 }),
    // Types: electronics, pharmaceuticals, food, general, etc.

    status: varchar("status", { length: 50 }).notNull().default("active"),
    // Status: active, investigating, resolved, closed

    // Location Information
    region: varchar("region", { length: 100 }).notNull(),
    // Regions: Memphis TN, Los Angeles CA, Dallas TX, etc.

    specificLocation: text("specific_location").notNull(),
    // e.g., "I-40 Pilot Travel Center, Exit 12"

    latitude: decimal("latitude", { precision: 10, scale: 7 }),
    longitude: decimal("longitude", { precision: 10, scale: 7 }),

    // Incident Details
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),

    // Time Information
    incidentDate: timestamp("incident_date", { withTimezone: true }).notNull(),
    incidentTime: varchar("incident_time", { length: 20 }),

    // Evidence
    hasPhotos: boolean("has_photos").notNull().default(false),
    hasVideo: boolean("has_video").notNull().default(false),
    evidenceCount: integer("evidence_count").notNull().default(0),

    // Estimated Loss (for theft incidents)
    estimatedLoss: decimal("estimated_loss", { precision: 12, scale: 2 }),

    // Engagement Metrics
    viewCount: integer("view_count").notNull().default(0),
    commentCount: integer("comment_count").notNull().default(0),
    shareCount: integer("share_count").notNull().default(0),

    // Reporter Details (from form)
    reporterName: varchar("reporter_name", { length: 255 }),
    reporterCompany: varchar("reporter_company", { length: 255 }),
    reporterContact: varchar("reporter_contact", { length: 255 }),

    // Metadata
    metadata: jsonb("metadata"),
    // Additional flexible data: vehicle descriptions, suspect info, etc.

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    reporterIdx: index("incident_reporter_idx").on(table.reporterId),
    typeIdx: index("incident_type_idx").on(table.incidentType),
    severityIdx: index("incident_severity_idx").on(table.severityLevel),
    regionIdx: index("incident_region_idx").on(table.region),
    statusIdx: index("incident_status_idx").on(table.status),
    dateIdx: index("incident_date_idx").on(table.incidentDate),
    createdAtIdx: index("incident_created_at_idx").on(table.createdAt),
  })
);

/**
 * Evidence Files
 * Photos and videos attached to incidents
 */
export const evidence = createTable(
  "evidence",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    incidentId: uuid("incident_id")
      .references(() => incidents.id, { onDelete: "cascade" })
      .notNull(),

    uploadedBy: uuid("uploaded_by")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    // File Information
    fileType: varchar("file_type", { length: 50 }).notNull(),
    // Types: image, video

    fileUrl: text("file_url").notNull(),
    // Supabase Storage URL

    fileName: varchar("file_name", { length: 255 }).notNull(),
    fileSize: integer("file_size"),
    // Size in bytes

    mimeType: varchar("mime_type", { length: 100 }),

    // Optional caption
    caption: text("caption"),

    // Metadata
    metadata: jsonb("metadata"),
    // EXIF data, dimensions, duration, etc.

    // Timestamps
    uploadedAt: timestamp("uploaded_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    incidentIdx: index("evidence_incident_idx").on(table.incidentId),
    uploaderIdx: index("evidence_uploader_idx").on(table.uploadedBy),
  })
);

/**
 * Comments & Discussion
 * Community discussion on incidents
 */
export const comments = createTable(
  "comment",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    incidentId: uuid("incident_id")
      .references(() => incidents.id, { onDelete: "cascade" })
      .notNull(),

    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    // Comment Content
    content: text("content").notNull(),

    // Threading (optional for future)
    parentCommentId: uuid("parent_comment_id"),

    // Moderation
    isEdited: boolean("is_edited").notNull().default(false),
    isFlagged: boolean("is_flagged").notNull().default(false),
    isDeleted: boolean("is_deleted").notNull().default(false),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    incidentIdx: index("comment_incident_idx").on(table.incidentId),
    userIdx: index("comment_user_idx").on(table.userId),
    createdAtIdx: index("comment_created_at_idx").on(table.createdAt),
  })
);

/**
 * Regions
 * Geographic regions for statistics and filtering
 */
export const regions = createTable(
  "region",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    name: varchar("name", { length: 255 }).notNull().unique(),
    // e.g., "Memphis, TN"

    state: varchar("state", { length: 2 }).notNull(),
    // Two-letter state code

    city: varchar("city", { length: 255 }).notNull(),

    // Geographic center for map
    latitude: decimal("latitude", { precision: 10, scale: 7 }),
    longitude: decimal("longitude", { precision: 10, scale: 7 }),

    // Priority Classification
    isPriority: boolean("is_priority").notNull().default(false),
    priorityRank: integer("priority_rank"),

    // Statistics (can be computed or cached)
    incidentCount: integer("incident_count").notNull().default(0),

    // Metadata
    description: text("description"),
    metadata: jsonb("metadata"),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    stateIdx: index("region_state_idx").on(table.state),
    priorityIdx: index("region_priority_idx").on(table.isPriority),
  })
);

/**
 * Resources
 * Educational materials, security products, partnerships
 */
export const resources = createTable(
  "resource",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Resource Classification
    category: varchar("category", { length: 100 }).notNull(),
    // Categories: product, educational, partnership, guide, report

    subcategory: varchar("subcategory", { length: 100 }),
    // Subcategories: gps_tracking, physical_security, surveillance, etc.

    // Resource Details
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),

    // External Links
    url: text("url"),
    companyUrl: text("company_url"),

    // Badge/Tag
    badge: varchar("badge", { length: 50 }),
    // Badges: Guide, Research, Directory, Report, Partner

    // Display
    iconType: varchar("icon_type", { length: 50 }),
    imageUrl: text("image_url"),

    // Ordering
    displayOrder: integer("display_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),

    // Metadata
    metadata: jsonb("metadata"),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    categoryIdx: index("resource_category_idx").on(table.category),
    activeIdx: index("resource_active_idx").on(table.isActive),
  })
);

/**
 * Notifications
 * Real-time alerts for users
 */
export const notifications = createTable(
  "notification",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    // Notification Type
    type: varchar("type", { length: 50 }).notNull(),
    // Types: new_incident, comment_reply, mention, system_alert

    // Content
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),

    // Link/Action
    linkUrl: text("link_url"),
    linkIncidentId: uuid("link_incident_id"),

    // Status
    isRead: boolean("is_read").notNull().default(false),
    readAt: timestamp("read_at", { withTimezone: true }),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    userIdx: index("notification_user_idx").on(table.userId),
    readIdx: index("notification_read_idx").on(table.isRead),
    createdAtIdx: index("notification_created_at_idx").on(table.createdAt),
  })
);

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Incident = typeof incidents.$inferSelect;
export type NewIncident = typeof incidents.$inferInsert;

export type Evidence = typeof evidence.$inferSelect;
export type NewEvidence = typeof evidence.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

export type Region = typeof regions.$inferSelect;
export type NewRegion = typeof regions.$inferInsert;

export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
