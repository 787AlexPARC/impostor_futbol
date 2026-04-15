import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const productsQuery = trpc.stripe.getProducts.useQuery();
  const createCheckoutMutation = trpc.stripe.createCheckoutSession.useMutation();

  const handlePurchase = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para comprar');
      return;
    }

    setLoading(productId);
    try {
      const result = await createCheckoutMutation.mutateAsync({
        productId,
      });

      if (result.url) {
        window.open(result.url, '_blank');
        toast.success('Redirigiendo a Stripe...');
      }
    } catch (error) {
      toast.error('Error al crear la sesión de pago');
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  if (productsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  const oneTimeProducts = productsQuery.data?.oneTime || [];
  const subscriptions = productsQuery.data?.subscriptions || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
      {/* Header */}
      <header className="border-b border-blue-500/20 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4 px-4 md:px-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
            PLANES Y PRECIOS
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12 px-4 md:px-0">
        {/* Intro */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Elige tu plan perfecto
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Desbloquea todas las características premium y disfruta de una experiencia sin límites
          </p>
        </div>

        {/* One-Time Products */}
        {oneTimeProducts.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Compras Únicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {oneTimeProducts.map((product: any) => (
                <Card
                  key={product.id}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-white mb-2">
                      {product.name}
                    </h4>
                    <p className="text-gray-400 text-sm mb-4">
                      {product.description}
                    </p>
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-white">
                        ${(product.priceInCents / 100).toFixed(2)}
                      </span>
                      <span className="text-gray-400 ml-2">USD</span>
                    </div>
                    <Button
                      onClick={() => handlePurchase(product.id)}
                      disabled={loading === product.id}
                      className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
                    >
                      {loading === product.id ? 'Procesando...' : 'Comprar Ahora'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Subscriptions */}
        {subscriptions.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Suscripciones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {subscriptions.map((product: any, index: number) => {
                const isRecommended = index === subscriptions.length - 1;
                return (
                  <Card
                    key={product.id}
                    className={`bg-gradient-to-br border transition-all duration-300 overflow-hidden ${
                      isRecommended
                        ? 'from-blue-900/50 to-orange-900/50 border-orange-500/50 md:col-span-2 md:max-w-md md:mx-auto ring-2 ring-orange-400/50'
                        : 'from-slate-800 to-slate-900 border-blue-500/20 hover:border-blue-400/50'
                    }`}
                  >
                    <div className="p-6 relative">
                      {isRecommended && (
                        <Badge className="absolute top-4 right-4 bg-orange-500 text-white">
                          RECOMENDADO
                        </Badge>
                      )}
                      <h4 className="text-xl font-bold text-white mb-2">
                        {product.name}
                      </h4>
                      <p className="text-gray-400 text-sm mb-4">
                        {product.description}
                      </p>
                      <div className="mb-6">
                        <span className="text-3xl font-bold text-white">
                          ${(product.priceInCents / 100).toFixed(2)}
                        </span>
                        <span className="text-gray-400 ml-2">
                          /{product.interval === 'month' ? 'mes' : 'año'}
                        </span>
                      </div>

                      {/* Features */}
                      <div className="mb-6 space-y-3">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Check className="w-5 h-5 text-green-400" />
                          <span>Todas las categorías</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Check className="w-5 h-5 text-green-400" />
                          <span>Categorías personalizadas ilimitadas</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Check className="w-5 h-5 text-green-400" />
                          <span>Sin anuncios</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Check className="w-5 h-5 text-green-400" />
                          <span>Estadísticas avanzadas</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Check className="w-5 h-5 text-green-400" />
                          <span>Soporte prioritario</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handlePurchase(product.id)}
                        disabled={loading === product.id}
                        className={`w-full font-bold py-2 px-4 rounded-lg transition-all duration-300 ${
                          isRecommended
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                        }`}
                      >
                        {loading === product.id ? 'Procesando...' : 'Suscribirse Ahora'}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Preguntas Frecuentes
          </h3>
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-blue-500/20">
              <div className="p-4">
                <h4 className="font-bold text-white mb-2">¿Puedo cambiar de plan?</h4>
                <p className="text-gray-400">
                  Sí, puedes cambiar o cancelar tu suscripción en cualquier momento desde tu cuenta.
                </p>
              </div>
            </Card>
            <Card className="bg-slate-800/50 border-blue-500/20">
              <div className="p-4">
                <h4 className="font-bold text-white mb-2">¿Hay período de prueba?</h4>
                <p className="text-gray-400">
                  Actualmente no ofrecemos período de prueba, pero puedes cancelar en cualquier momento.
                </p>
              </div>
            </Card>
            <Card className="bg-slate-800/50 border-blue-500/20">
              <div className="p-4">
                <h4 className="font-bold text-white mb-2">¿Qué métodos de pago aceptan?</h4>
                <p className="text-gray-400">
                  Aceptamos todas las tarjetas de crédito y débito a través de Stripe.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
