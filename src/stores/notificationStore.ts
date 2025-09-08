import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionText?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [
        // Notificaciones de ejemplo para admin
        {
          id: '1',
          title: 'Nuevo pedido recibido',
          message: 'Se ha recibido un nuevo pedido #OCF-2024-001 por RD$2,450',
          type: 'info',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
          actionUrl: '/admin/orders',
          actionText: 'Ver pedido'
        },
        {
          id: '2',
          title: 'Stock bajo',
          message: 'El producto "Vestido Rojo Elegante" tiene solo 2 unidades en stock',
          type: 'warning',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          actionUrl: '/admin/products',
          actionText: 'Revisar stock'
        },
        {
          id: '3',
          title: 'Producto agotado',
          message: 'El producto "Zapatos Negros Clásicos" se ha agotado',
          type: 'error',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          actionUrl: '/admin/products',
          actionText: 'Reabastecer'
        },
        {
          id: '4',
          title: 'Nuevo usuario registrado',
          message: 'Un nuevo usuario se ha registrado: maria.garcia@email.com',
          type: 'success',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
          actionUrl: '/admin/users',
          actionText: 'Ver usuario'
        },
        {
          id: '5',
          title: 'Backup completado',
          message: 'El backup diario de la base de datos se completó exitosamente',
          type: 'success',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        }
      ],
      unreadCount: 3,

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          read: false,
          createdAt: new Date(),
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
          unreadCount: 0,
        }));
      },

      deleteNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          const wasUnread = notification && !notification.read;
          
          return {
            notifications: state.notifications.filter((notif) => notif.id !== id),
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
          };
        });
      },

      clearAll: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
      },
    }),
    {
      name: 'admin-notifications',
    }
  )
);










