import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Package, 
  FolderOpen, 
  Palette, 
  Images, 
  Users, 
  ShoppingCart, 
  BarChart3,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import AdminHeader from '../../components/AdminHeader';
import ProductSheet from '../../components/ProductSheet';
import { seedAllData } from '../../data/seedData';
import { showToast } from '../../components/CustomToast';
import { useFirestoreTest } from '../../hooks/useFirestoreTest';
import { useState } from 'react';

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3, current: location.pathname === '/admin' },
    { name: 'Productos', href: '/admin/products', icon: Package, current: location.pathname.startsWith('/admin/products') },
    { name: 'Categorías', href: '/admin/categories', icon: FolderOpen, current: location.pathname.startsWith('/admin/categories') },
    { name: 'Atributos', href: '/admin/attributes', icon: Palette, current: location.pathname.startsWith('/admin/attributes') },
    { name: 'Imágenes', href: '/admin/images', icon: Images, current: location.pathname.startsWith('/admin/images') },
    { name: 'Usuarios', href: '/admin/users', icon: Users, current: location.pathname.startsWith('/admin/users') },
    { name: 'Pedidos', href: '/admin/orders', icon: ShoppingCart, current: location.pathname.startsWith('/admin/orders') },
    { name: 'Configuración', href: '/admin/settings', icon: Settings, current: location.pathname.startsWith('/admin/settings') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="Otro Coro Fashion"
              />
              <span className="ml-2 text-xl font-bold text-primary">Admin</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md smooth-transition`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className="mr-4 h-6 w-6 flex-shrink-0"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 animate-fade-in">
              <img
                className="h-8 w-auto hover-lift"
                src="/logo.png"
                alt="Otro Coro Fashion"
              />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Admin
              </span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1 animate-slide-up">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? 'bg-primary text-primary-foreground hover-glow'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover-lift'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md smooth-transition animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <item.icon
                    className="mr-3 h-6 w-6 flex-shrink-0"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Admin Header */}
        <AdminHeader 
          onToggleSidebar={() => setSidebarOpen(true)} 
          sidebarOpen={sidebarOpen} 
        />

        <main className="flex-1 animate-fade-in bg-muted/30">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {location.pathname === '/admin' ? <DashboardHome /> : <Outlet />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const DashboardHome: React.FC = () => {
  const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
  const [seedingData, setSeedingData] = useState(false);
  const { isConnected, error: firestoreError, loading: firestoreLoading } = useFirestoreTest();

  const handleSeedData = async () => {
    setSeedingData(true);
    try {
      await seedAllData();
      showToast({
        title: 'Datos creados',
        message: 'Los datos de ejemplo han sido creados exitosamente',
        type: 'success'
      });
    } catch (error) {
      console.error('Error seeding data:', error);
      showToast({
        title: 'Error',
        message: 'Error al crear los datos de ejemplo',
        type: 'error'
      });
    } finally {
      setSeedingData(false);
    }
  };
  
  const stats = [
    { name: 'Total Productos', value: '124', change: '+12%', changeType: 'positive' },
    { name: 'Pedidos Hoy', value: '23', change: '+5.4%', changeType: 'positive' },
    { name: 'Ingresos Mes', value: 'RD$45,231', change: '+8.2%', changeType: 'positive' },
    { name: 'Usuarios Activos', value: '1,234', change: '-2.1%', changeType: 'negative' },
  ];

  const quickActions = [
    {
      title: 'Agregar Producto',
      description: 'Crea un nuevo producto para tu tienda',
      icon: Package,
      color: 'bg-blue-500',
      action: () => {
        if (!isConnected) {
          showToast({
            title: 'Error de conexión',
            message: 'No se puede conectar con Firestore. Verifica tu conexión.',
            type: 'error'
          });
          return;
        }
        setIsProductSheetOpen(true);
      }
    },
    {
      title: 'Nueva Categoría',
      description: 'Organiza mejor tus productos',
      icon: FolderOpen,
      color: 'bg-green-500',
      action: () => window.location.href = '/admin/categories/new'
    },
    {
      title: 'Gestionar Atributos',
      description: 'Añade colores, tallas y otros atributos',
      icon: Palette,
      color: 'bg-purple-500',
      action: () => window.location.href = '/admin/attributes'
    },
    {
      title: 'Ver Pedidos',
      description: 'Revisa los pedidos pendientes',
      icon: ShoppingCart,
      color: 'bg-orange-500',
      action: () => window.location.href = '/admin/orders'
    }
  ];

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Panel de Control
            </h1>
            <p className="mt-2 text-muted-foreground">
              Bienvenido al panel de administración de Otro Coro Fashion
            </p>
            {firestoreLoading && (
              <p className="text-sm text-blue-600 mt-1">🔄 Conectando con Firestore...</p>
            )}
            {!firestoreLoading && isConnected && (
              <p className="text-sm text-green-600 mt-1">✅ Firestore conectado</p>
            )}
            {!firestoreLoading && !isConnected && firestoreError && (
              <p className="text-sm text-red-600 mt-1">❌ Error Firestore: {firestoreError}</p>
            )}
          </div>
          <Button
            variant="outline"
            onClick={handleSeedData}
            disabled={seedingData}
            className="flex items-center space-x-2"
          >
            {seedingData ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Creando datos...</span>
              </>
            ) : (
              <>
                <Package className="h-4 w-4" />
                <span>Datos de Ejemplo</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={stat.name} className={`hover-lift animate-scale-in`} style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} desde el mes pasado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card key={action.title} className="hover-lift animate-fade-in cursor-pointer group" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={action.action}>
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{action.title}</h3>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover-lift animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Gestión de Productos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Administra tu catálogo de productos, precios y stock.
            </p>
            <Link to="/admin/products">
              <Button className="w-full hover-glow">Ver Productos</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FolderOpen className="mr-2 h-5 w-5" />
              Categorías
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Organiza tus productos en categorías y subcategorías.
            </p>
            <Link to="/admin/categories">
              <Button className="w-full hover-glow">Gestionar Categorías</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Revisa y gestiona todos los pedidos de tus clientes.
            </p>
            <Link to="/admin/orders">
              <Button className="w-full hover-glow">Ver Pedidos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Product Sheet */}
      <ProductSheet 
        isOpen={isProductSheetOpen}
        onClose={() => setIsProductSheetOpen(false)}
        onSave={() => {
          // Refresh data if needed
          console.log('Product saved');
        }}
      />
    </div>
  );
};

export default AdminDashboard;

