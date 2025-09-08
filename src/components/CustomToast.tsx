import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info,
  X
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastComponent: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(toast.id), 300);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div
      className={`${
        isVisible ? 'animate-in slide-in-from-right-2' : 'animate-out slide-out-to-right-2'
      } transition-all duration-300`}
    >
      <div className={`flex items-start space-x-3 p-4 rounded-lg border ${getBgColor()} shadow-lg`}>
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{toast.title}</p>
          {toast.message && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => onClose(toast.id)}
          className="flex-shrink-0 ml-4 inline-flex text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Toast Container
export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToast = (event: CustomEvent<Toast>) => {
      const newToast = { ...event.detail, id: Date.now().toString() };
      setToasts(prev => [...prev, newToast]);
    };

    window.addEventListener('show-toast' as any, handleToast);
    return () => window.removeEventListener('show-toast' as any, handleToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-md">
      {toasts.map(toast => (
        <ToastComponent key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};

// Helper function to show toast
export const showToast = (toast: Omit<Toast, 'id'>) => {
  const event = new CustomEvent('show-toast', { detail: toast });
  window.dispatchEvent(event);
};
