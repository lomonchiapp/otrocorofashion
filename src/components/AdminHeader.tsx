import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  User, 
  Sun, 
  Moon, 
  Settings,
  LogOut,
  ChevronDown,
  Home,
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useThemeStore } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';
import NotificationSheet from './NotificationSheet';

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar, sidebarOpen }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationSheetOpen, setIsNotificationSheetOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

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

  // Cerrar sheets con Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNotificationSheetOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile sidebar toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onToggleSidebar}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Breadcrumb / Title */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Panel de Administración</span>
          </div>
        </div>

        {/* Center - Title/Status */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="text-sm text-muted-foreground">
            Panel de Administración • {new Date().toLocaleDateString('es-DO')}
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
            onClick={() => setIsNotificationSheetOpen(true)}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs animate-pulse"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>

          {/* Settings */}
          <Link to="/admin/settings">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-muted transition-colors"
            >
              <Settings className="h-4 w-4" />
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
                  {user.displayName?.charAt(0) || user.firstName?.charAt(0) || user.email?.charAt(0) || 'A'}
                </div>
                <span className="hidden sm:block text-sm font-medium max-w-20 truncate">
                  Admin
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
                  <p className="font-medium text-sm">Administrador</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                
                <Link to="/admin/settings" className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors">
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

      {/* Notification Sheet */}
      <NotificationSheet 
        isOpen={isNotificationSheetOpen} 
        onClose={() => setIsNotificationSheetOpen(false)} 
      />
    </header>
  );
};

export default AdminHeader;
