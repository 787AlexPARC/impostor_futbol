import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ===== ROUTERS PARA EL MINIJUEGO IMPOSTOR FUTBOL =====
  game: router({
    // Crear sesión de juego
    createSession: publicProcedure
      .input(z.object({
        categoryId: z.string(),
        numberOfPlayers: z.number().min(2).max(10),
        selectedCharacter: z.string(),
        impostorIndex: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await db.createGameSession({
          userId: ctx.user?.id,
          categoryId: input.categoryId,
          numberOfPlayers: input.numberOfPlayers,
          selectedCharacter: input.selectedCharacter,
          impostorIndex: input.impostorIndex,
          gameStatus: 'in_progress',
        });
        return result;
      }),

    // Obtener sesión de juego
    getSession: publicProcedure
      .input(z.object({ sessionId: z.number() }))
      .query(async ({ input }) => {
        return await db.getGameSession(input.sessionId);
      }),

    // Actualizar estado de sesión
    updateSessionStatus: publicProcedure
      .input(z.object({
        sessionId: z.number(),
        status: z.enum(['in_progress', 'completed', 'abandoned']),
      }))
      .mutation(async ({ input }) => {
        await db.updateGameSessionStatus(input.sessionId, input.status);
        return { success: true };
      }),

    // Guardar resultados de juego
    saveResults: publicProcedure
      .input(z.object({
        sessionId: z.number(),
        results: z.array(z.object({
          playerIndex: z.number(),
          wasImpostor: z.number(),
          wasCorrectlyIdentified: z.number(),
        })),
      }))
      .mutation(async ({ input }) => {
        await db.saveGameResults(input.sessionId, input.results);
        return { success: true };
      }),

    // Obtener resultados de juego
    getResults: publicProcedure
      .input(z.object({ sessionId: z.number() }))
      .query(async ({ input }) => {
        return await db.getGameResults(input.sessionId);
      }),
  }),

  // ===== ROUTERS PARA CATEGORÍAS PERSONALIZADAS =====
  categories: router({
    // Crear categoría personalizada
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        icon: z.string().optional(),
        isPublic: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const categoryData = {
          name: input.name,
          description: input.description || null,
          icon: input.icon || null,
          isPublic: input.isPublic || 0,
        };
        const result = await db.createCustomCategory(ctx.user.id, categoryData);
        return result;
      }),

    // Obtener categorías personalizadas del usuario
    getUserCategories: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getUserCustomCategories(ctx.user.id);
      }),

    // Eliminar categoría personalizada
    delete: protectedProcedure
      .input(z.object({ categoryId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.deleteCustomCategory(input.categoryId, ctx.user.id);
        return { success: true };
      }),
  }),

  // ===== ROUTERS PARA PERSONAJES PERSONALIZADOS =====
  characters: router({
    // Agregar personaje a categoría
    add: protectedProcedure
      .input(z.object({
        categoryId: z.number(),
        name: z.string(),
        position: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const characterData = {
          name: input.name,
          position: input.position || null,
        };
        const result = await db.addCustomCharacter(input.categoryId, characterData);
        return result;
      }),

    // Obtener personajes de categoría
    getByCategory: publicProcedure
      .input(z.object({ categoryId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCustomCharacters(input.categoryId);
      }),

    // Eliminar personaje
    delete: protectedProcedure
      .input(z.object({ characterId: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteCustomCharacter(input.characterId);
        return { success: true };
      }),
  }),

  // ===== ROUTERS PARA ESTADÍSTICAS DE USUARIO =====
  stats: router({
    // Obtener estadísticas del usuario
    getStats: protectedProcedure
      .query(async ({ ctx }) => {
        let stats = await db.getUserStats(ctx.user.id);
        if (!stats) {
          await db.createUserStats(ctx.user.id);
          stats = await db.getUserStats(ctx.user.id);
        }
        return stats;
      }),

    // Actualizar estadísticas del usuario
    updateStats: protectedProcedure
      .input(z.object({
        totalGamesPlayed: z.number().optional(),
        totalImpostorRoles: z.number().optional(),
        totalImpostorsIdentified: z.number().optional(),
        totalWinsAsImpostor: z.number().optional(),
        totalWinsAsRegular: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.updateUserStats(ctx.user.id, input);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
