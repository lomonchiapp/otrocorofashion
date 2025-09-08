import React from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Bell, 
  Check, 
  Trash2, 
  ExternalLink,
  CheckCheck,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useNotificationStore } from '../stores/notificationStore';

interface NotificationSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationSheet: React.FC<NotificationSheetProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotificationStore();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'error':
        return 'border-l-red-500';
      default:
        return 'border-l-blue-500';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  // Get recent notifications (last 10)
  const recentNotifications = notifications.slice(0, 10);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in-0"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed right-4 top-20 w-96 max-w-[calc(100vw-2rem)] bg-background border border-border rounded-xl shadow-2xl z-50 animate-in slide-in-from-right-2 duration-300 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Notificaciones</h2>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-8 px-2 text-xs"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Marcar todas
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {recentNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No hay notificaciones</p>
              <p className="text-xs text-muted-foreground">
                Las notificaciones aparecerán aquí cuando ocurran eventos importantes
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentNotifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors relative border-l-2 ${
                    getNotificationBorderColor(notification.type)
                  } ${!notification.read ? 'bg-muted/30' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`text-sm font-medium leading-tight ${
                          !notification.read ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {notification.title}
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full inline-block ml-2" />
                          )}
                        </h3>
                        <div className="flex items-center space-x-1 ml-2">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      <p className={`text-xs leading-relaxed mb-2 ${
                        !notification.read ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        {notification.actionUrl && (
                          <Link 
                            to={notification.actionUrl}
                            onClick={() => {
                              if (!notification.read) {
                                markAsRead(notification.id);
                              }
                              onClose();
                            }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs"
                            >
                              <span>{notification.actionText || 'Ver más'}</span>
                              <ExternalLink className="h-2 w-2 ml-1" />
                            </Button>
                          </Link>
                        )}
                        
                        <div className="flex items-center space-x-1 ml-auto">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-600"
                              title="Marcar como leída"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                            title="Eliminar notificación"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {notifications.length > 10 && `Mostrando las 10 más recientes de ${notifications.length}`}
            </div>
            <div className="flex space-x-2">
              <Link to="/admin/notifications" onClick={onClose}>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                  Ver todas
                </Button>
              </Link>
              <Link to="/admin/settings" onClick={onClose}>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Settings className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationSheet;










