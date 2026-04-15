/**
 * Definición de productos y precios para Stripe
 * Estos son los productos disponibles en el minijuego Impostor Futbol
 */

export const STRIPE_PRODUCTS = {
  // Productos de compra única (one-time payment)
  PREMIUM_PACK: {
    id: 'premium_pack',
    name: 'Premium Pack',
    description: 'Desbloquea 10 categorías premium adicionales',
    priceInCents: 999, // $9.99
    type: 'one_time',
  },
  CUSTOM_CATEGORIES: {
    id: 'custom_categories',
    name: 'Categorías Personalizadas Ilimitadas',
    description: 'Crea y guarda categorías personalizadas sin límite',
    priceInCents: 1999, // $19.99
    type: 'one_time',
  },
  AD_FREE: {
    id: 'ad_free',
    name: 'Experiencia Sin Anuncios',
    description: 'Juega sin interrupciones publicitarias',
    priceInCents: 499, // $4.99
    type: 'one_time',
  },

  // Productos de suscripción (recurring)
  MONTHLY_SUBSCRIPTION: {
    id: 'monthly_subscription',
    name: 'Suscripción Mensual Pro',
    description: 'Acceso a todas las características premium',
    priceInCents: 799, // $7.99/mes
    interval: 'month',
    type: 'subscription',
  },
  YEARLY_SUBSCRIPTION: {
    id: 'yearly_subscription',
    name: 'Suscripción Anual Pro',
    description: 'Acceso a todas las características premium por un año',
    priceInCents: 7999, // $79.99/año (ahorra $15.89)
    interval: 'year',
    type: 'subscription',
  },
};

export type ProductKey = keyof typeof STRIPE_PRODUCTS;
export type Product = typeof STRIPE_PRODUCTS[ProductKey];

/**
 * Obtener producto por ID
 */
export function getProductById(productId: string): Product | undefined {
  return Object.values(STRIPE_PRODUCTS).find(p => p.id === productId);
}

/**
 * Obtener todos los productos de compra única
 */
export function getOneTimeProducts(): Product[] {
  return Object.values(STRIPE_PRODUCTS).filter(p => p.type === 'one_time');
}

/**
 * Obtener todas las suscripciones
 */
export function getSubscriptionProducts(): Product[] {
  return Object.values(STRIPE_PRODUCTS).filter(p => p.type === 'subscription');
}

/**
 * Formatear precio para mostrar
 */
export function formatPrice(priceInCents: number, currency: string = 'USD'): string {
  const dollars = (priceInCents / 100).toFixed(2);
  return `$${dollars}`;
}
