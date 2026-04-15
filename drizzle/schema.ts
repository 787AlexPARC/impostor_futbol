import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }), // Stripe customer ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ===== TABLAS PARA EL MINIJUEGO IMPOSTOR FUTBOL =====

/**
 * Tabla para guardar categorías personalizadas de usuarios
 */
export const customCategories = mysqlTable("custom_categories", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  isPublic: int("isPublic").default(0).notNull(), // 0 = private, 1 = public
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomCategory = typeof customCategories.$inferSelect;
export type InsertCustomCategory = typeof customCategories.$inferInsert;

/**
 * Tabla para guardar personajes en categorías personalizadas
 */
export const customCharacters = mysqlTable("custom_characters", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  position: varchar("position", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CustomCharacter = typeof customCharacters.$inferSelect;
export type InsertCustomCharacter = typeof customCharacters.$inferInsert;

/**
 * Tabla para guardar sesiones de juego
 */
export const gameSessions = mysqlTable("game_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  categoryId: varchar("categoryId", { length: 255 }).notNull(), // ID de categoría (puede ser predefinida o personalizada)
  numberOfPlayers: int("numberOfPlayers").notNull(),
  selectedCharacter: varchar("selectedCharacter", { length: 255 }).notNull(),
  impostorIndex: int("impostorIndex").notNull(), // Índice del jugador impostor (0 a numberOfPlayers-1)
  gameStatus: mysqlEnum("gameStatus", ["in_progress", "completed", "abandoned"]).default("in_progress").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type GameSession = typeof gameSessions.$inferSelect;
export type InsertGameSession = typeof gameSessions.$inferInsert;

/**
 * Tabla para guardar resultados de partidas
 */
export const gameResults = mysqlTable("game_results", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  playerIndex: int("playerIndex").notNull(), // Índice del jugador (0 a numberOfPlayers-1)
  wasImpostor: int("wasImpostor").default(0).notNull(), // 0 = no, 1 = sí
  wasCorrectlyIdentified: int("wasCorrectlyIdentified").default(0).notNull(), // 0 = no, 1 = sí
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GameResult = typeof gameResults.$inferSelect;
export type InsertGameResult = typeof gameResults.$inferInsert;

/**
 * Tabla para guardar estadísticas de usuarios
 */
export const userStats = mysqlTable("user_stats", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  totalGamesPlayed: int("totalGamesPlayed").default(0).notNull(),
  totalImpostorRoles: int("totalImpostorRoles").default(0).notNull(),
  totalImpostorsIdentified: int("totalImpostorsIdentified").default(0).notNull(),
  totalWinsAsImpostor: int("totalWinsAsImpostor").default(0).notNull(),
  totalWinsAsRegular: int("totalWinsAsRegular").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = typeof userStats.$inferInsert;

// ===== TABLAS PARA STRIPE (PAGOS Y SUSCRIPCIONES) =====

/**
 * Tabla para guardar órdenes/pagos de usuarios
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }).notNull().unique(),
  amount: int("amount").notNull(), // Cantidad en centavos (ej: 1000 = $10.00)
  currency: varchar("currency", { length: 3 }).default("usd").notNull(),
  status: mysqlEnum("status", ["pending", "succeeded", "failed", "canceled"]).default("pending").notNull(),
  productId: varchar("productId", { length: 255 }),
  productName: varchar("productName", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Tabla para guardar suscripciones de usuarios
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }).notNull().unique(),
  stripePriceId: varchar("stripePriceId", { length: 255 }).notNull(),
  stripeProductId: varchar("stripeProductId", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["active", "past_due", "canceled", "paused"]).default("active").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  canceledAt: timestamp("canceledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Tabla para guardar historial de facturas
 */
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  subscriptionId: int("subscriptionId"),
  stripeInvoiceId: varchar("stripeInvoiceId", { length: 255 }).notNull().unique(),
  amount: int("amount").notNull(), // Cantidad en centavos
  currency: varchar("currency", { length: 3 }).default("usd").notNull(),
  status: mysqlEnum("status", ["draft", "open", "paid", "uncollectible", "void"]).default("open").notNull(),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;