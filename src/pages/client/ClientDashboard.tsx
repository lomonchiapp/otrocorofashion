import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Heart, 
  ShoppingBag, 
  User, 
  CreditCard,
  MapPin,
  Bell,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useApp } from '../../context/AppContext';
import { useAuthStore } from '../../stores/authStore';

const ClientDashboard: React.FC = () => {
  const { state, getCartItemsCount } = useApp();
  const { user } = useAuthStore();

  const cartItemsCount = getCartItemsCount();

  const quickStats = [
    { 
      name: 'Pedidos Activos', 
      value: '3', 
      icon: Package, 
      href: '/client/orders',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      name: 'Lista de Deseos', 
      value: state.wishlist.length.toString(), 
      icon: Heart, 
      href: '/wishlist',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    { 
      name: 'En el Carrito', 
      value: cartItemsCount.toString(), 
      icon: ShoppingBag, 
      href: '/cart',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      name: 'Puntos de Fidelidad', 
      value: '1,250', 
      icon: CreditCard, 
      href: '/client/loyalty',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
  ];

  const quickActions = [
    {
      name: 'Ver Mis Pedidos',
      description: 'Revisa el estado de tus compras',
      icon: Package,
      href: '/client/orders',
      color: 'bg-blue-500'
    },
    {
      name: 'Mi Perfil',
      description: 'Actualiza tu información personal',
      icon: User,
      href: '/client/profile',
      color: 'bg-green-500'
    },
    {
      name: 'Métodos de Pago',
      description: 'Gestiona tus tarjetas y métodos de pago',
      icon: CreditCard,
      href: '/client/payment-methods',
      color: 'bg-purple-500'
    },
    {
      name: 'Direcciones',
      description: 'Administra tus direcciones de envío',
      icon: MapPin,
      href: '/client/addresses',
      color: 'bg-orange-500'
    },
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            ¡Bienvenido, {user?.displayName || user?.firstName || 'Usuario'}!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Gestiona tu cuenta y revisa tus pedidos desde tu panel personal
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Link key={stat.name} to={stat.href}>
              <Card className={`hover-lift animate-scale-in cursor-pointer group transition-all duration-300`} 
                    style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.name}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Pedidos Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">#OCF-2024-001</p>
                    <p className="text-xs text-muted-foreground">Enviado - Llega mañana</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">RD$2,450</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">#OCF-2024-002</p>
                    <p className="text-xs text-muted-foreground">En preparación</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">RD$1,890</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">#OCF-2024-003</p>
                    <p className="text-xs text-muted-foreground">Entregado</p>
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">RD$3,200</span>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/client/orders">Ver Todos los Pedidos</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex-1">
                    <p className="font-medium text-sm">Tu pedido está en camino</p>
                    <p className="text-xs text-muted-foreground">Pedido #OCF-2024-001 - Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex-1">
                    <p className="font-medium text-sm">¡Oferta especial disponible!</p>
                    <p className="text-xs text-muted-foreground">20% de descuento en tu categoría favorita - Hace 1 día</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="flex-1">
                    <p className="font-medium text-sm">Puntos de fidelidad ganados</p>
                    <p className="text-xs text-muted-foreground">+150 puntos por tu última compra - Hace 3 días</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/client/notifications">Ver Todas</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link key={action.name} to={action.href}>
              <Card className="hover-lift animate-fade-in cursor-pointer group transition-all duration-300" 
                    style={{ animationDelay: `${(index + 4) * 0.1}s` }}>
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
