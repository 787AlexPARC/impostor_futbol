import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Orders() {
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();

  const ordersQuery = trpc.stripe.getUserOrders.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const subscriptionsQuery = trpc.stripe.getUserSubscriptions.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const invoicesQuery = trpc.stripe.getUserInvoices.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800 border-blue-500/20 p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Acceso Requerido</h2>
          <p className="text-gray-400 mb-6">
            Debes iniciar sesión para ver tu historial de órdenes y suscripciones.
          </p>
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-bold"
          >
            Ir a Inicio
          </Button>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
      case 'active':
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
      case 'open':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'failed':
      case 'canceled':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      succeeded: 'Completado',
      pending: 'Pendiente',
      failed: 'Fallido',
      canceled: 'Cancelado',
      active: 'Activo',
      past_due: 'Vencido',
      paused: 'Pausado',
      paid: 'Pagado',
      open: 'Abierto',
      draft: 'Borrador',
      uncollectible: 'Incobrable',
      void: 'Anulado',
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
      {/* Header */}
      <header className="border-b border-blue-500/20 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4 px-4 md:px-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
            MIS COMPRAS Y SUSCRIPCIONES
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12 px-4 md:px-0">
        {/* Órdenes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Compras Únicas</h2>
          {ordersQuery.isLoading ? (
            <div className="text-center text-gray-400">Cargando órdenes...</div>
          ) : (ordersQuery.data?.length || 0) > 0 ? (
            <div className="space-y-4">
              {ordersQuery.data?.map((order: any) => (
                <Card
                  key={order.id}
                  className="bg-slate-800/50 border-blue-500/20 p-6 hover:border-blue-400/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(order.status)}
                        <h3 className="text-lg font-bold text-white">
                          {order.productName}
                        </h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        {order.description}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {formatDistanceToNow(new Date(order.createdAt), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        ${(order.amount / 100).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {getStatusLabel(order.status)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-800/50 border-blue-500/20 p-6 text-center">
              <p className="text-gray-400">No tienes compras únicas aún.</p>
              <Button
                onClick={() => navigate('/pricing')}
                className="mt-4 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-bold"
              >
                Ver Productos
              </Button>
            </Card>
          )}
        </div>

        {/* Suscripciones */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Suscripciones</h2>
          {subscriptionsQuery.isLoading ? (
            <div className="text-center text-gray-400">Cargando suscripciones...</div>
          ) : (subscriptionsQuery.data?.length || 0) > 0 ? (
            <div className="space-y-4">
              {subscriptionsQuery.data?.map((subscription: any) => (
                <Card
                  key={subscription.id}
                  className="bg-slate-800/50 border-blue-500/20 p-6 hover:border-blue-400/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(subscription.status)}
                        <h3 className="text-lg font-bold text-white">
                          Suscripción {subscription.stripeProductId}
                        </h3>
                      </div>
                      <div className="text-gray-400 text-sm space-y-1">
                        <p>
                          Período actual: {new Date(subscription.currentPeriodStart).toLocaleDateString('es-ES')} -{' '}
                          {new Date(subscription.currentPeriodEnd).toLocaleDateString('es-ES')}
                        </p>
                        <p>
                          Suscrito hace{' '}
                          {formatDistanceToNow(new Date(subscription.createdAt), {
                            locale: es,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400 mb-2">
                        {getStatusLabel(subscription.status)}
                      </p>
                      {subscription.status === 'active' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-800/50 border-blue-500/20 p-6 text-center">
              <p className="text-gray-400">No tienes suscripciones activas.</p>
              <Button
                onClick={() => navigate('/pricing')}
                className="mt-4 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-bold"
              >
                Ver Planes
              </Button>
            </Card>
          )}
        </div>

        {/* Facturas */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Facturas</h2>
          {invoicesQuery.isLoading ? (
            <div className="text-center text-gray-400">Cargando facturas...</div>
          ) : (invoicesQuery.data?.length || 0) > 0 ? (
            <div className="space-y-4">
              {invoicesQuery.data?.map((invoice: any) => (
                <Card
                  key={invoice.id}
                  className="bg-slate-800/50 border-blue-500/20 p-6 hover:border-blue-400/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(invoice.status)}
                        <h3 className="text-lg font-bold text-white">
                          Factura #{invoice.stripeInvoiceId.slice(-8)}
                        </h3>
                      </div>
                      <p className="text-gray-500 text-xs">
                        {formatDistanceToNow(new Date(invoice.createdAt), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        ${(invoice.amount / 100).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {getStatusLabel(invoice.status)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-800/50 border-blue-500/20 p-6 text-center">
              <p className="text-gray-400">No tienes facturas aún.</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
