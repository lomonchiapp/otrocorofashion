import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Plus, Minus, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { formatPrice, calculateDiscount } from '../lib/utils';
import type { ProductVariant, Color, Size } from '../types';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  
  const [selectedColorId, setSelectedColorId] = useState<string>('');
  const [selectedSizeId, setSelectedSizeId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Encontrar el producto
  const product = useMemo(() => {
    return mockProducts.find(p => p.slug === slug);
  }, [slug]);

  // Productos relacionados (misma categoría)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return mockProducts
      .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  // Variante seleccionada
  const selectedVariant = useMemo(() => {
    if (!product || !selectedColorId || !selectedSizeId) return null;
    return product.variants.find(
      variant => variant.colorId === selectedColorId && variant.sizeId === selectedSizeId
    );
  }, [product, selectedColorId, selectedSizeId]);

  // Configurar selecciones iniciales
  React.useEffect(() => {
    if (product && !selectedColorId && product.availableColors.length > 0) {
      setSelectedColorId(product.availableColors[0].id);
    }
    if (product && !selectedSizeId && product.availableSizes.length > 0) {
      setSelectedSizeId(product.availableSizes[0].id);
    }
  }, [product, selectedColorId, selectedSizeId]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <Button onClick={() => navigate('/products')}>
          Volver a productos
        </Button>
      </div>
    );
  }

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.basePrice;
  const discount = hasDiscount ? calculateDiscount(product.basePrice, product.compareAtPrice!) : 0;
  const isWishlisted = isInWishlist(product.id);
  const maxStock = selectedVariant?.stock || 0;

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(product, selectedVariant, quantity);
    }
  };

  const handleWishlistToggle = () => {
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
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }
    
    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center hover:text-primary">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver
        </button>
        <span>/</span>
        <span>Productos</span>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.images[activeImageIndex]?.url}
              alt={product.images[activeImageIndex]?.alt || product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setActiveImageIndex(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 ${
                    index === activeImageIndex ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and Price */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} reseñas)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold">
                {formatPrice(product.basePrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                  <Badge variant="destructive">
                    -{discount}% OFF
                  </Badge>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              {product.stockTotal > 0 ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  ✓ En stock ({product.stockTotal} disponibles)
                </Badge>
              ) : (
                <Badge variant="destructive">
                  Agotado
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Color Selection */}
          {product.availableColors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">
                Color: {product.availableColors.find(c => c.id === selectedColorId)?.name}
              </h3>
              <div className="flex gap-3">
                {product.availableColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColorId(color.id)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColorId === color.id ? 'border-primary' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.availableSizes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">
                Talla: {product.availableSizes.find(s => s.id === selectedSizeId)?.name}
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {product.availableSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSizeId(size.id)}
                    className={`px-4 py-3 text-center border rounded-md transition-colors ${
                      selectedSizeId === size.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    {size.abbreviation}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="font-semibold mb-3">Cantidad</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                  disabled={quantity >= maxStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {maxStock > 0 && (
                <span className="text-sm text-muted-foreground">
                  {maxStock} disponibles
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant || maxStock === 0}
                className="flex-1"
                size="lg"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {maxStock === 0 ? 'Agotado' : 'Agregar al carrito'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleWishlistToggle}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
              </Button>
            </div>

            <Button variant="ghost" className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir producto
            </Button>
          </div>

          {/* Product Details */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Detalles del producto</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>SKU:</span>
                  <span>{selectedVariant?.sku || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Categoría:</span>
                  <span>{product.category?.name || 'Sin categoría'}</span>
                </div>
                {product.tags.length > 0 && (
                  <div className="flex justify-between">
                    <span>Etiquetas:</span>
                    <span>{product.tags.join(', ')}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Productos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
