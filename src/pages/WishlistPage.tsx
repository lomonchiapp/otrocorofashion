import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useApp } from '../context/AppContext';
import { formatPrice, calculateDiscount } from '../lib/utils';
import { Badge } from '../components/ui/badge';

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, removeFromWishlist, addToCart } = useApp();
  const { wishlist } = state;

  const handleAddToCart = (product: any) => {
    const firstAvailableVariant = product.variants.find((variant: any) => variant.stock > 0);
    if (firstAvailableVariant) {
      addToCart(product, firstAvailableVariant, 1);
      // Optionally remove from wishlist after adding to cart
      // removeFromWishlist(product.id);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 animate-fade-in">
        <div className="text-center max-w-md mx-auto animate-slide-up">
          <div className="relative mb-8">
            <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-4 animate-bounce-in" />
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl scale-150 animate-pulse"></div>
          </div>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Tu lista de deseos está vacía
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            ¡Guarda tus productos favoritos aquí para no perderlos!
          </p>
          <Button size="lg" onClick={() => navigate('/products')} className="hover-glow animate-scale-in">
            Explorar productos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 animate-slide-up">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center hover-lift smooth-transition"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="border-l border-gray-300 pl-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Lista de deseos
          </h1>
          <p className="text-muted-foreground">
            <span className="animate-bounce-in inline-block">
              {wishlist.length} {wishlist.length === 1 ? 'producto guardado' : 'productos guardados'}
            </span>
          </p>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((item, index) => {
          const { product } = item;
          const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
          const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.basePrice;
          const discount = hasDiscount ? calculateDiscount(product.basePrice, product.compareAtPrice!) : 0;
          const firstAvailableVariant = product.variants.find(variant => variant.stock > 0);

          return (
            <Card 
              key={item.id} 
              className={`group relative overflow-hidden hover-lift animate-scale-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                {/* Product Image */}
                <img
                  src={primaryImage?.url}
                  alt={primaryImage?.alt || product.name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 cursor-pointer"
                  onClick={() => navigate(`/product/${product.slug}`)}
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isFeatured && (
                    <Badge variant="destructive" className="text-xs animate-bounce-in">
                      Destacado
                    </Badge>
                  )}
                  {hasDiscount && (
                    <Badge variant="destructive" className="text-xs animate-bounce-in">
                      -{discount}%
                    </Badge>
                  )}
                  {product.stockTotal === 0 && (
                    <Badge variant="secondary" className="text-xs animate-bounce-in">
                      Agotado
                    </Badge>
                  )}
                </div>

                {/* Remove from Wishlist Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white hover-glow animate-scale-in"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>

                {/* Add to Cart Button */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 smooth-transition">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={!firstAvailableVariant || product.stockTotal === 0}
                    className="w-full hover-glow animate-bounce-in"
                    size="sm"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {product.stockTotal === 0 ? 'Agotado' : 'Agregar al carrito'}
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                {/* Product Info */}
                <div className="space-y-2">
                  <h3 
                    className="font-semibold text-sm line-clamp-2 group-hover:text-primary smooth-transition cursor-pointer"
                    onClick={() => navigate(`/product/${product.slug}`)}
                  >
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">
                      {formatPrice(product.basePrice)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.compareAtPrice!)}
                      </span>
                    )}
                  </div>

                  {/* Colors Available */}
                  {product.availableColors.length > 1 && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground mr-2">Colores:</span>
                      <div className="flex gap-1">
                        {product.availableColors.slice(0, 4).map((color) => (
                          <div
                            key={color.id}
                            className="w-4 h-4 rounded-full border border-gray-200 hover:scale-110 smooth-transition"
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                        {product.availableColors.length > 4 && (
                          <span className="text-xs text-muted-foreground">
                            +{product.availableColors.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stock Status */}
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      product.stockTotal === 0 ? 'bg-red-500' :
                      product.stockTotal <= 5 ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <span className="text-xs text-muted-foreground">
                      {product.stockTotal === 0 ? 'Agotado' :
                       product.stockTotal <= 5 ? `Solo ${product.stockTotal} disponibles` : 'En stock'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 animate-slide-up">
        <Button
          variant="outline"
          onClick={() => navigate('/products')}
          className="hover-lift"
        >
          Seguir comprando
        </Button>
        <Button
          onClick={() => {
            // Add all available items to cart
            wishlist.forEach(item => {
              const firstAvailableVariant = item.product.variants.find(variant => variant.stock > 0);
              if (firstAvailableVariant) {
                addToCart(item.product, firstAvailableVariant, 1);
              }
            });
            navigate('/cart');
          }}
          className="hover-glow"
          disabled={wishlist.every(item => item.product.stockTotal === 0)}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Agregar todo al carrito
        </Button>
      </div>
    </div>
  );
};

export default WishlistPage;

