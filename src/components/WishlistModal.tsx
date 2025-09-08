import React from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useApp } from '../context/AppContext';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose }) => {
  const { state, removeFromWishlist, addToCart } = useApp();

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (product: any) => {
    // Agregar la primera variante disponible al carrito
    const firstVariant = product.variants[0];
    if (firstVariant) {
      addToCart(product, firstVariant, 1);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in-0"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed right-4 top-20 w-96 max-w-[calc(100vw-2rem)] bg-background border border-border rounded-xl shadow-2xl z-50 animate-in slide-in-from-right-2 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-primary fill-current" />
            <h2 className="font-semibold text-lg">Mi Lista de Deseos</h2>
            <Badge variant="secondary" className="ml-2">
              {state.wishlist.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {state.wishlist.length === 0 ? (
            <div className="p-8 text-center">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Tu lista de deseos está vacía</p>
              <Button onClick={onClose} asChild>
                <Link to="/products">
                  Explorar Productos
                </Link>
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {state.wishlist.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 group">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.images[0]?.url || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.product.description}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleAddToCart(item.product)}
                      title="Agregar al carrito"
                    >
                      <ShoppingBag className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFromWishlist(item.productId)}
                      title="Eliminar de wishlist"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.wishlist.length > 0 && (
          <div className="border-t border-border p-4">
            <Button 
              className="w-full" 
              onClick={onClose} 
              asChild
            >
              <Link to="/wishlist">
                Ver Lista Completa
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistModal;










