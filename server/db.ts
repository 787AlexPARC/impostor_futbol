import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, customCategories, customCharacters, gameSessions, gameResults, userStats, InsertCustomCategory, InsertCustomCharacter, InsertGameSession, InsertGameResult, InsertUserStats } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== FUNCIONES PARA CATEGORÍAS PERSONALIZADAS =====

export async function createCustomCategory(userId: number, data: Omit<InsertCustomCategory, 'userId'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(customCategories).values({
    ...data,
    userId,
  });
  
  return result;
}

export async function getUserCustomCategories(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(customCategories).where(eq(customCategories.userId, userId));
}

export async function deleteCustomCategory(categoryId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verificar que el usuario es el propietario
  const category = await db.select().from(customCategories).where(eq(customCategories.id, categoryId)).limit(1);
  if (!category.length || category[0].userId !== userId) {
    throw new Error("Unauthorized");
  }
  
  // Eliminar personajes asociados
  await db.delete(customCharacters).where(eq(customCharacters.categoryId, categoryId));
  
  // Eliminar categoría
  await db.delete(customCategories).where(eq(customCategories.id, categoryId));
}

// ===== FUNCIONES PARA PERSONAJES PERSONALIZADOS =====

export async function addCustomCharacter(categoryId: number, data: Omit<InsertCustomCharacter, 'categoryId'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(customCharacters).values({
    ...data,
    categoryId,
  });
}

export async function getCustomCharacters(categoryId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(customCharacters).where(eq(customCharacters.categoryId, categoryId));
}

export async function deleteCustomCharacter(characterId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(customCharacters).where(eq(customCharacters.id, characterId));
}

// ===== FUNCIONES PARA SESIONES DE JUEGO =====

export async function createGameSession(data: InsertGameSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(gameSessions).values(data);
  return result;
}

export async function getGameSession(sessionId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(gameSessions).where(eq(gameSessions.id, sessionId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateGameSessionStatus(sessionId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(gameSessions)
    .set({ gameStatus: status as any, completedAt: new Date() })
    .where(eq(gameSessions.id, sessionId));
}

// ===== FUNCIONES PARA RESULTADOS DE JUEGO =====

export async function saveGameResults(sessionId: number, results: Omit<InsertGameResult, 'sessionId'>[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  for (const result of results) {
    await db.insert(gameResults).values({
      ...result,
      sessionId,
    });
  }
}

export async function getGameResults(sessionId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(gameResults).where(eq(gameResults.sessionId, sessionId));
}

// ===== FUNCIONES PARA ESTADÍSTICAS DE USUARIO =====

export async function getUserStats(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createUserStats(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(userStats).values({
    userId,
    totalGamesPlayed: 0,
    totalImpostorRoles: 0,
    totalImpostorsIdentified: 0,
    totalWinsAsImpostor: 0,
    totalWinsAsRegular: 0,
  });
}

export async function updateUserStats(userId: number, updates: Partial<InsertUserStats>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Obtener stats actuales
  let stats = await getUserStats(userId);
  
  // Si no existen, crearlas
  if (!stats) {
    await createUserStats(userId);
    stats = await getUserStats(userId);
  }
  
  if (stats) {
    await db.update(userStats)
      .set(updates)
      .where(eq(userStats.userId, userId));
  }
}

export async function incrementUserStats(userId: number, field: keyof Omit<InsertUserStats, 'userId' | 'createdAt' | 'updatedAt' | 'id'>, increment: number = 1) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Obtener stats actuales
  let stats = await getUserStats(userId);
  
  // Si no existen, crearlas
  if (!stats) {
    await createUserStats(userId);
    stats = await getUserStats(userId);
  }
  
  if (stats) {
    const currentValue = (stats[field as keyof typeof stats] as number) || 0;
    await db.update(userStats)
      .set({ [field]: currentValue + increment } as any)
      .where(eq(userStats.userId, userId));
  }
}
