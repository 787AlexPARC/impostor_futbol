import { eq } from "drizzle-orm";
import { orders, subscriptions, invoices, users, Order, InsertOrder, Subscription, InsertSubscription, Invoice, InsertInvoice } from "../drizzle/schema";
import { getDb } from "./db";

// ===== FUNCIONES PARA ÓRDENES/PAGOS =====

export async function createOrder(data: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(orders).values(data);
}

export async function getOrder(orderId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getOrderByStripePaymentIntentId(paymentIntentId: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(orders).where(eq(orders.stripePaymentIntentId, paymentIntentId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(orders).where(eq(orders.userId, userId));
}

export async function updateOrderStatus(orderId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(orders)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(orders.id, orderId));
}

// ===== FUNCIONES PARA SUSCRIPCIONES =====

export async function createSubscription(data: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(subscriptions).values(data);
}

export async function getSubscription(subscriptionId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(subscriptions).where(eq(subscriptions.id, subscriptionId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getSubscriptionByStripeId(stripeSubscriptionId: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(subscriptions).where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getUserSubscriptions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
}

export async function getUserActiveSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const { and } = await import('drizzle-orm');
  const result = await db.select().from(subscriptions)
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, 'active' as any)))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function updateSubscriptionStatus(subscriptionId: number, status: string, currentPeriodStart?: Date, currentPeriodEnd?: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = {
    status: status as any,
    updatedAt: new Date(),
  };
  
  if (currentPeriodStart) updateData.currentPeriodStart = currentPeriodStart;
  if (currentPeriodEnd) updateData.currentPeriodEnd = currentPeriodEnd;
  
  await db.update(subscriptions)
    .set(updateData)
    .where(eq(subscriptions.id, subscriptionId));
}

export async function cancelSubscription(subscriptionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(subscriptions)
    .set({ 
      status: 'canceled' as any,
      canceledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, subscriptionId));
}

// ===== FUNCIONES PARA FACTURAS =====

export async function createInvoice(data: InsertInvoice) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(invoices).values(data);
}

export async function getInvoice(invoiceId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getInvoiceByStripeId(stripeInvoiceId: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(invoices).where(eq(invoices.stripeInvoiceId, stripeInvoiceId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getUserInvoices(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(invoices).where(eq(invoices.userId, userId));
}

export async function updateInvoiceStatus(invoiceId: number, status: string, paidAt?: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = {
    status: status as any,
    updatedAt: new Date(),
  };
  
  if (paidAt) updateData.paidAt = paidAt;
  
  await db.update(invoices)
    .set(updateData)
    .where(eq(invoices.id, invoiceId));
}

// ===== FUNCIONES PARA USUARIOS (STRIPE) =====

export async function updateUserStripeCustomerId(userId: number, stripeCustomerId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(users)
    .set({ stripeCustomerId, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

export async function getUserByStripeCustomerId(stripeCustomerId: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(users).where(eq(users.stripeCustomerId, stripeCustomerId)).limit(1);
  return result.length > 0 ? result[0] : null;
}
