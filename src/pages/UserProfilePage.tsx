import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  CreditCard,
  Bell,
  Shield,
  Edit,
  Camera,
  Save,
  Mail,
  Phone,
  Calendar,
  Award,
  Star,
  Package
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAuthStore } from '../stores/authStore';
import { useApp } from '../context/AppContext';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other' | '';
  avatar: string;
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  date: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
}

const UserProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    firstName: user?.firstName || 'Juan',
    lastName: user?.lastName || 'Pérez',
    email: user?.email || 'juan@ejemplo.com',
    phone: '+1 (809) 555-0123',
    birthDate: '1990-01-01',
    gender: 'male',
    avatar: '/avatars/user-default.jpg'
  });

  const [addresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      name: 'Casa',
      address: 'Calle Principal #123, Ensanche Naco',
      city: 'Santo Domingo',
      state: 'Distrito Nacional',
      zipCode: '10101',
      isDefault: true
    },
    {
      id: '2',
      type: 'work',
      name: 'Oficina',
      address: 'Av. 27 de Febrero #1234, Piantini',
      city: 'Santo Domingo',
      state: 'Distrito Nacional',
      zipCode: '10102',
      isDefault: false
    }
  ]);

  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'OC-2024-001',
      date: new Date('2024-01-15'),
      status: 'delivered',
      total: 4500,
      items: 3
    },
    {
      id: '2',
      orderNumber: 'OC-2024-002',
      date: new Date('2024-01-10'),
      status: 'shipped',
      total: 2800,
      items: 2
    },
    {
      id: '3',
      orderNumber: 'OC-2024-003',
      date: new Date('2024-01-05'),
      status: 'processing',
      total: 6200,
      items: 4
    }
  ]);

  const handleProfileSave = () => {
    // Aquí guardarías los cambios en el backend
    setIsEditing(false);
  };

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { label: 'Pendiente', variant: 'outline' as const, color: 'text-yellow-600' },
      processing: { label: 'Procesando', variant: 'default' as const, color: 'text-blue-600' },
      shipped: { label: 'Enviado', variant: 'secondary' as const, color: 'text-purple-600' },
      delivered: { label: 'Entregado', variant: 'default' as const, color: 'text-green-600' },
      cancelled: { label: 'Cancelado', variant: 'destructive' as const, color: 'text-red-600' }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>;
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'orders', label: 'Mis Pedidos', icon: ShoppingBag },
    { id: 'addresses', label: 'Direcciones', icon: MapPin },
    { id: 'wishlist', label: 'Lista de Deseos', icon: Heart },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={profile.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full shadow-lg"
                onClick={() => {/* TODO: Implementar cambio de avatar */}}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-muted-foreground text-lg mb-4">{profile.email}</p>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Cliente VIP</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-blue-500" />
                  <span>{orders.length} pedidos realizados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-500" />
                  <span>{state.wishlist.length} productos favoritos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                          activeTab === tab.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Información Personal</CardTitle>
                  <Button
                    variant={isEditing ? 'default' : 'outline'}
                    onClick={isEditing ? handleProfileSave : () => setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Nombre</label>
                      <Input
                        value={profile.firstName}
                        onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Apellido</label>
                      <Input
                        value={profile.lastName}
                        onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        Email
                      </label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        Teléfono
                      </label>
                      <Input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Fecha de Nacimiento
                      </label>
                      <Input
                        type="date"
                        value={profile.birthDate}
                        onChange={(e) => setProfile(prev => ({ ...prev, birthDate: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Género</label>
                      <select
                        value={profile.gender}
                        onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value as any }))}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      >
                        <option value="">Seleccionar</option>
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                        <option value="other">Otro</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <Card>
                <CardHeader>
                  <CardTitle>Mis Pedidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Package className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <h4 className="font-medium">{order.orderNumber}</h4>
                              <p className="text-sm text-muted-foreground">
                                {order.date.toLocaleDateString('es-DO')} • {order.items} artículos
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg">
                            {new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(order.total)}
                          </span>
                          <Button variant="outline" size="sm">
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Mis Direcciones</CardTitle>
                  <Button>
                    <MapPin className="h-4 w-4 mr-2" />
                    Agregar Dirección
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{address.name}</h4>
                            {address.isDefault && (
                              <Badge variant="secondary">Por defecto</Badge>
                            )}
                          </div>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-muted-foreground">
                          {address.address}<br />
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Mi Lista de Deseos ({state.wishlist.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {state.wishlist.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Tu lista de deseos está vacía</h3>
                      <p className="text-muted-foreground mb-4">
                        Agrega productos que te gusten para encontrarlos fácilmente después
                      </p>
                      <Button>Explorar Productos</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {state.wishlist.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-40 object-cover rounded mb-3"
                          />
                          <h4 className="font-medium mb-2">{item.name}</h4>
                          <p className="text-lg font-bold mb-3">
                            {new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(item.price)}
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              Agregar al Carrito
                            </Button>
                            <Button variant="outline" size="sm">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notificaciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Ofertas y Promociones</h4>
                        <p className="text-sm text-muted-foreground">Recibe ofertas exclusivas por email</p>
                      </div>
                      <Button variant="outline" size="sm">Activado</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Actualizaciones de Pedidos</h4>
                        <p className="text-sm text-muted-foreground">Notificaciones sobre el estado de tus pedidos</p>
                      </div>
                      <Button variant="outline" size="sm">Activado</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Nuevos Productos</h4>
                        <p className="text-sm text-muted-foreground">Recibe alertas de nuevas llegadas</p>
                      </div>
                      <Button variant="outline" size="sm">Desactivado</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Seguridad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Cambiar Contraseña</h4>
                        <p className="text-sm text-muted-foreground">Actualiza tu contraseña regularmente</p>
                      </div>
                      <Button variant="outline">Cambiar</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Verificación en Dos Pasos</h4>
                        <p className="text-sm text-muted-foreground">Agrega una capa extra de seguridad</p>
                      </div>
                      <Button variant="outline">Configurar</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Métodos de Pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No hay métodos de pago guardados</h3>
                      <p className="text-muted-foreground mb-4">
                        Guarda tus métodos de pago para checkout más rápido
                      </p>
                      <Button>Agregar Método de Pago</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
