import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import type { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatPrice, calculateDiscount } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.basePrice;
  const discount = hasDiscount ? calculateDiscount(product.basePrice, product.compareAtPrice!) : 0;
  const isWishlisted = isInWishlist(product.id);
  
  // Obtener la primera variante disponible para agregar al carrito
  const firstAvailableVariant = product.variants.find(variant => variant.stock > 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (firstAvailableVariant) {
      addToCart(product, firstAvailableVariant, 1);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-3 w-3 fill-yellow-400/50 text-yellow-400" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />
      );
    }
    
    return stars;
  };

  return (
    <Card className={`group relative overflow-hidden hover-lift smooth-transition animate-fade-in ${className}`}>
      <Link to={`/product/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          {/* Product Image */}
          <img
            src={primaryImage?.url}
            alt={primaryImage?.alt || product.name}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {/* Loading placeholder */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isFeatured && (
              <Badge variant="destructive" className="text-xs">
                Destacado
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs">
                -{discount}%
              </Badge>
            )}
            {product.stockTotal === 0 && (
              <Badge variant="secondary" className="text-xs">
                Agotado
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 opacity-0 group-hover:opacity-100 smooth-transition bg-white/90 hover:bg-white hover-glow animate-scale-in ${
              isWishlisted ? 'opacity-100' : ''
            }`}
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`h-4 w-4 ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </Button>

          {/* Add to Cart Button - Mobile */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 smooth-transition md:hidden">
            <Button
              onClick={handleAddToCart}
              disabled={!firstAvailableVariant || product.stockTotal === 0}
              className="w-full hover-glow animate-bounce-in"
              size="sm"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Product Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {renderStars(product.rating)}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount})
                </span>
              </div>
            )}

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
                      className="w-4 h-4 rounded-full border border-gray-200"
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
          </div>

          {/* Add to Cart Button - Desktop */}
          <div className="hidden md:block mt-4 opacity-0 group-hover:opacity-100 smooth-transition">
            <Button
              onClick={handleAddToCart}
              disabled={!firstAvailableVariant || product.stockTotal === 0}
              className="w-full hover-glow animate-scale-in"
              size="sm"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {product.stockTotal === 0 ? 'Agotado' : 'Agregar al carrito'}
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
