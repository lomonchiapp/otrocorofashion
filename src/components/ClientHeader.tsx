import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User, 
  Sun, 
  Moon, 
  Settings,
  LogOut,
  ChevronDown,
  Home,
  ShoppingBag,
  Heart,
  Package,
  CreditCard
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useThemeStore } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import { useApp } from '../context/AppContext';

const ClientHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { state, getCartItemsCount } = useApp();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const cartItemsCount = getCartItemsCount();

  // Cerrar menú de usuario al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Otro Coro Fashion" 
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hidden sm:block">
              Mi Cuenta
            </span>
          </Link>

          {/* Quick Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              to="/products" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Explorar
            </Link>
            <Link 
              to="/client/orders" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Mis Pedidos
            </Link>
            <Link 
              to="/wishlist" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Mi Lista
            </Link>
          </nav>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-9 border-0 bg-muted/50 focus:bg-background transition-colors rounded-full"
                />
              </div>
            </form>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative h-9 w-9 rounded-full hover:bg-muted transition-colors"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Cambiar tema</span>
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-full hover:bg-muted transition-colors"
          >
            <Bell className="h-4 w-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
            >
              2
            </Badge>
          </Button>

          {/* Wishlist */}
          <Link to="/wishlist">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-9 w-9 rounded-full hover:bg-muted transition-colors group"
            >
              <Heart className="h-4 w-4 transition-colors group-hover:text-primary" />
              {state.wishlist.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs animate-pulse"
                >
                  {state.wishlist.length}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Cart */}
          <Link to="/cart">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-9 w-9 rounded-full hover:bg-muted transition-colors group"
            >
              <ShoppingBag className="h-4 w-4 transition-colors group-hover:text-primary" />
              {cartItemsCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs animate-pulse"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          <div className="relative" data-user-menu>
            {user ? (
              <Button
                variant="ghost"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="h-9 px-3 rounded-full hover:bg-muted transition-colors flex items-center space-x-2"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-xs font-medium">
                  {user.displayName?.charAt(0) || user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:block text-sm font-medium max-w-20 truncate">
                  {user.displayName || user.firstName || 'Usuario'}
                </span>
                <ChevronDown className={`h-3 w-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted transition-colors">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {/* User Dropdown */}
            {isUserMenuOpen && user && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg py-2 animate-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-border">
                  <p className="font-medium text-sm">{user.displayName || user.firstName || 'Usuario'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                
                <Link to="/client" className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors">
                  <User className="h-4 w-4 mr-3" />
                  Mi Dashboard
                </Link>
                
                <Link to="/client/profile" className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors">
                  <User className="h-4 w-4 mr-3" />
                  Mi Perfil
                </Link>
                
                <Link to="/client/orders" className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors">
                  <Package className="h-4 w-4 mr-3" />
                  Mis Pedidos
                </Link>
                
                <Link to="/client/payment-methods" className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors">
                  <CreditCard className="h-4 w-4 mr-3" />
                  Métodos de Pago
                </Link>
                
                <Link to="/client/settings" className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors">
                  <Settings className="h-4 w-4 mr-3" />
                  Configuración
                </Link>
                
                <Link to="/" className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors">
                  <Home className="h-4 w-4 mr-3" />
                  Ir a la Tienda
                </Link>
                
                <div className="border-t border-border mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors w-full text-left text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden border-t border-border/40 px-4 py-2">
        <form onSubmit={handleSearch} className="flex">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-9 border-0 bg-muted/50 focus:bg-background transition-colors rounded-full"
            />
          </div>
        </form>
      </div>
    </header>
  );
};

export default ClientHeader;
