import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Bell,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useApp } from '../context/AppContext';
import { useThemeStore } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import { mockCategories } from '../data/mockData';
import CartModal from './CartModal';
import WishlistModal from './WishlistModal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const { state, getCartItemsCount } = useApp();
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
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

  // Cerrar menús al hacer click fuera
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

  // Cerrar modales con Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCartModalOpen(false);
        setIsWishlistModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Otro Coro Fashion" 
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hidden sm:block">
              Otro Coro
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <form onSubmit={handleSearch} className="flex w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar productos, marcas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 h-10 border-0 bg-muted/50 focus:bg-background transition-colors rounded-full"
                  />
                </div>
              </form>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>

          {/* Actions */}
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

            {/* Search Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 rounded-full hover:bg-muted"
              onClick={() => {/* TODO: Implement mobile search */}}
            >
              <Search className="h-4 w-4" />
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
                3
              </Badge>
            </Button>

            {/* Wishlist */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-9 w-9 rounded-full hover:bg-muted transition-colors group"
              onClick={() => setIsWishlistModalOpen(true)}
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

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-9 w-9 rounded-full hover:bg-muted transition-colors group"
              onClick={() => setIsCartModalOpen(true)}
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
                  
                  <Link to="/profile" className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <User className="h-4 w-4 mr-3" />
                    Mi Perfil
                  </Link>
                  
                  <Link to="/orders" className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <ShoppingBag className="h-4 w-4 mr-3" />
                    Mis Pedidos
                  </Link>
                  
                  <Link to="/settings" className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <Settings className="h-4 w-4 mr-3" />
                    Configuración
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

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 rounded-full hover:bg-muted"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center justify-center py-3 border-t border-border/50">
          <div className="flex items-center space-x-8">
            <Link 
              to="/products" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group py-2"
            >
              Todos los Productos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            {mockCategories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group py-2"
              >
                {category.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            ))}
            <Link 
              to="/sale" 
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors relative group py-2 px-3 bg-primary/10 rounded-full"
            >
              🔥 Ofertas
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur border-t border-border/40">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-10 border-0 bg-muted/50 focus:bg-background transition-colors rounded-full"
                />
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/products" 
                className="text-foreground hover:text-primary transition-colors font-medium py-3 px-4 rounded-lg hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Todos los Productos
              </Link>
              {mockCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="text-foreground hover:text-primary transition-colors font-medium py-3 px-4 rounded-lg hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link 
                to="/sale" 
                className="text-primary hover:text-primary/80 transition-colors font-medium py-3 px-4 rounded-lg bg-primary/10"
                onClick={() => setIsMenuOpen(false)}
              >
                🔥 Ofertas
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Modales */}
      <CartModal 
        isOpen={isCartModalOpen} 
        onClose={() => setIsCartModalOpen(false)} 
      />
      <WishlistModal 
        isOpen={isWishlistModalOpen} 
        onClose={() => setIsWishlistModalOpen(false)} 
      />
    </header>
  );
};

export default Header;