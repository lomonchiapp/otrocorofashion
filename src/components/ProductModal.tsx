import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Tag, 
  DollarSign,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Star
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { formatPrice } from '../lib/utils';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any; // Using any for now, should be FirestoreProduct type
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  // Get all images (general + color specific)
  const getAllImages = () => {
    const images = [...(product.images || [])];
    
    // Add variant images if any
    product.variants?.forEach((variant: any) => {
      if (variant.images?.length > 0) {
        images.push(...variant.images.map((url: string) => ({ 
          url, 
          colorId: variant.colorId,
          alt: `${product.name} - ${variant.colorId}`
        })));
      }
    });
    
    return images;
  };

  const allImages = getAllImages();
  const currentImage = allImages[selectedImageIndex];

  // Get unique colors from variants
  const getUniqueColors = () => {
    const colors = new Map();
    product.variants?.forEach((variant: any) => {
      if (!colors.has(variant.colorId)) {
        colors.set(variant.colorId, {
          id: variant.colorId,
          name: variant.colorName || 'Color',
          hexCode: variant.colorHex || '#000000',
          hasImages: variant.images?.length > 0
        });
      }
    });
    return Array.from(colors.values());
  };

  const uniqueColors = getUniqueColors();

  // Get stock status
  const getStockStatus = () => {
    const totalStock = product.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || 0;
    if (totalStock === 0) return { status: 'out', color: 'destructive', text: 'Agotado', icon: AlertCircle };
    if (totalStock <= 5) return { status: 'low', color: 'warning', text: 'Stock Bajo', icon: AlertCircle };
    return { status: 'good', color: 'success', text: 'En Stock', icon: CheckCircle };
  };

  const stockStatus = getStockStatus();

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in-0"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-background border border-border rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <Package className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Detalles del Producto</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid md:grid-cols-2 gap-8 p-6">
              {/* Images Section */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  {currentImage ? (
                    <img
                      src={currentImage.url}
                      alt={currentImage.alt || product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-20 w-20 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {allImages.length > 0 && (
                  <div className="grid grid-cols-6 gap-2">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                        } hover:border-primary/50`}
                      >
                        <img
                          src={image.url}
                          alt={image.alt || `${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Title and Status */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-2xl font-bold">{product.name}</h3>
                    <div className="flex items-center space-x-2">
                      {product.isActive ? (
                        <Badge variant="default" className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Activo
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <EyeOff className="h-3 w-3" />
                          Inactivo
                        </Badge>
                      )}
                      {product.isFeatured && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Destacado
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(product.price || product.basePrice)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-xl text-muted-foreground line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                  {product.compareAtPrice && (
                    <Badge variant="destructive" className="text-xs">
                      {Math.round(((product.compareAtPrice - (product.price || product.basePrice)) / product.compareAtPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>

                {/* Stock Status */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <stockStatus.icon className={`h-5 w-5 ${
                          stockStatus.status === 'good' ? 'text-green-500' :
                          stockStatus.status === 'low' ? 'text-yellow-500' : 'text-red-500'
                        }`} />
                        <span className="font-medium">{stockStatus.text}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Total: {product.stockTotal || product.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || 0} unidades
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Colors */}
                {uniqueColors.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Colores Disponibles</h4>
                    <div className="flex flex-wrap gap-2">
                      {uniqueColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColorId(color.id)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all ${
                            selectedColorId === color.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div 
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: color.hexCode }}
                          />
                          <span className="text-sm">{color.name}</span>
                          {color.hasImages && (
                            <ImageIcon className="h-3 w-3 text-muted-foreground" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variants */}
                <div className="space-y-3">
                  <h4 className="font-medium">Variantes del Producto</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {product.variants?.map((variant: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{variant.sku}</Badge>
                          <span className="text-sm">{variant.colorName || 'Color'}</span>
                          <span className="text-sm">{variant.sizeName || 'Talla'}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium">{formatPrice(variant.price)}</span>
                          <Badge variant={variant.stock > 0 ? 'default' : 'destructive'}>
                            Stock: {variant.stock}
                          </Badge>
                        </div>
                      </div>
                    )) || (
                      <p className="text-sm text-muted-foreground">No hay variantes configuradas</p>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {product.tags?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      Etiquetas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category & SKU */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <span className="text-sm text-muted-foreground">Categoría</span>
                    <p className="font-medium">{product.categoryName || 'Sin categoría'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">SKU Principal</span>
                    <p className="font-medium">{product.variants?.[0]?.sku || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Creado</span>
                    <p className="font-medium">
                      {product.createdAt ? new Date(product.createdAt).toLocaleDateString('es-DO') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Actualizado</span>
                    <p className="font-medium">
                      {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString('es-DO') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;










