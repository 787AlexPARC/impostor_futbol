import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import Stripe from "stripe";
import * as stripeDb from "./stripe-db";
import { STRIPE_PRODUCTS, getProductById } from "./products";
import { ENV } from "./_core/env";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-03-25.dahlia" as any,
});

export const stripeRouter = router({
  // ===== CREAR SESIÓN DE PAGO =====
  createCheckoutSession: protectedProcedure
    .input(z.object({
      productId: z.string(),
      successUrl: z.string().optional(),
      cancelUrl: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const product = getProductById(input.productId);
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      const successUrl = input.successUrl || `${ctx.req.headers.origin}/success`;
      const cancelUrl = input.cancelUrl || `${ctx.req.headers.origin}/pricing`;

      try {
        const session = await stripe.checkout.sessions.create({
          customer_email: ctx.user.email || "",
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
            product_id: product.id,
          },
              line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: product.name,
                  description: product.description,
                },
                unit_amount: product.priceInCents,
                ...(product.type === "subscription" && {
                  recurring: {
                    interval: (product as any).interval as "month" | "year",
                  },
                }),
              },
              quantity: 1,
            },
          ],
          mode: product.type === "subscription" ? "subscription" : "payment",
          success_url: successUrl,
          cancel_url: cancelUrl,
          allow_promotion_codes: true,
        });

        return {
          sessionId: session.id,
          url: session.url,
        };
      } catch (error) {
        console.error("[Stripe] Error creating checkout session:", error);
        throw new Error("No se pudo crear la sesión de pago");
      }
    }),

  // ===== OBTENER ÓRDENES DEL USUARIO =====
  getUserOrders: protectedProcedure
    .query(async ({ ctx }) => {
      return await stripeDb.getUserOrders(ctx.user.id);
    }),

  // ===== OBTENER SUSCRIPCIONES DEL USUARIO =====
  getUserSubscriptions: protectedProcedure
    .query(async ({ ctx }) => {
      return await stripeDb.getUserSubscriptions(ctx.user.id);
    }),

  // ===== OBTENER SUSCRIPCIÓN ACTIVA =====
  getActiveSubscription: protectedProcedure
    .query(async ({ ctx }) => {
      return await stripeDb.getUserActiveSubscription(ctx.user.id);
    }),

  // ===== OBTENER FACTURAS DEL USUARIO =====
  getUserInvoices: protectedProcedure
    .query(async ({ ctx }) => {
      return await stripeDb.getUserInvoices(ctx.user.id);
    }),

  // ===== CANCELAR SUSCRIPCIÓN =====
  cancelSubscription: protectedProcedure
    .input(z.object({
      subscriptionId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const subscription = await stripeDb.getSubscription(input.subscriptionId);
      
      if (!subscription || subscription.userId !== ctx.user.id) {
        throw new Error("Suscripción no encontrada");
      }

      try {
        // Cancelar en Stripe
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
        
        // Actualizar en base de datos
        await stripeDb.cancelSubscription(input.subscriptionId);
        
        return { success: true };
      } catch (error) {
        console.error("[Stripe] Error canceling subscription:", error);
        throw new Error("No se pudo cancelar la suscripción");
      }
    }),

  // ===== OBTENER PORTAL DE FACTURACIÓN =====
  getPortalSession: protectedProcedure
    .input(z.object({
      returnUrl: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Obtener o crear cliente de Stripe
        let stripeCustomerId = ctx.user.stripeCustomerId;
        
        if (!stripeCustomerId) {
          const customer = await stripe.customers.create({
            email: ctx.user.email || undefined,
            name: ctx.user.name || undefined,
            metadata: {
              user_id: ctx.user.id.toString(),
            },
          });
          
          stripeCustomerId = customer.id;
          await stripeDb.updateUserStripeCustomerId(ctx.user.id, stripeCustomerId);
        }

        const returnUrl = input.returnUrl || `${ctx.req.headers.origin}/account`;

        const session = await stripe.billingPortal.sessions.create({
          customer: stripeCustomerId,
          return_url: returnUrl,
        } as any);

        return {
          url: session.url,
        };
      } catch (error) {
        console.error("[Stripe] Error creating portal session:", error);
        throw new Error("No se pudo crear la sesión del portal de facturación");
      }
    }),

  // ===== OBTENER PRODUCTOS DISPONIBLES =====
  getProducts: publicProcedure
    .query(async () => {
      return {
        oneTime: Object.values(STRIPE_PRODUCTS).filter(p => p.type === "one_time"),
        subscriptions: Object.values(STRIPE_PRODUCTS).filter(p => p.type === "subscription"),
      };
    }),
});

export type StripeRouter = typeof stripeRouter;
