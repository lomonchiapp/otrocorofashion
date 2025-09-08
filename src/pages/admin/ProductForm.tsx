import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  X, 
  Plus,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { mockCategories, mockColors, mockSizes } from '../../data/mockData';

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  basePrice: number;
  compareAtPrice: number;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  variants: Array<{
    colorId: string;
    sizeId: string;
    sku: string;
    price: number;
    compareAtPrice: number;
    stock: number;
  }>;
}

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    categoryId: '',
    basePrice: 0,
    compareAtPrice: 0,
    tags: [],
    isFeatured: false,
    isActive: true,
    images: [],
    variants: []
  });

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-generate slug from name
    if (field === 'name') {
      const slug = value.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, {
        url: '',
        alt: '',
        isPrimary: prev.images.length === 0
      }]
    }));
  };

  const updateImage = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        colorId: '',
        sizeId: '',
        sku: '',
        price: formData.basePrice,
        compareAtPrice: formData.compareAtPrice,
        stock: 0
      }]
    }));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would integrate with Firebase
      console.log('Product data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/products')}
            className="hover-lift"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Productos
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Nuevo Producto
            </h1>
            <p className="text-muted-foreground">
              Completa la información del producto
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="hover-lift">
            <Eye className="h-4 w-4 mr-2" />
            Vista Previa
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="hover-glow"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Producto
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nombre del Producto *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Vestido Rojo Elegante"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Slug (URL)</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="vestido-rojo-elegante"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Descripción Corta</label>
                <Input
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  placeholder="Descripción breve para listados"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Descripción Completa *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descripción detallada del producto..."
                  className="w-full min-h-[120px] px-3 py-2 border border-input rounded-md bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle>Precios</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Precio Base (RD$) *</label>
                <Input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => handleInputChange('basePrice', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Precio de Comparación (RD$)</label>
                <Input
                  type="number"
                  value={formData.compareAtPrice}
                  onChange={(e) => handleInputChange('compareAtPrice', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Imágenes</CardTitle>
                <Button type="button" onClick={addImage} size="sm" className="hover-glow">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Imagen
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.images.map((image, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3 hover-lift">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Imagen {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={image.isPrimary ? 'default' : 'outline'}>
                        {image.isPrimary ? 'Principal' : 'Secundaria'}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeImage(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block">URL de la Imagen</label>
                      <Input
                        value={image.url}
                        onChange={(e) => updateImage(index, 'url', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Texto Alternativo</label>
                      <Input
                        value={image.alt}
                        onChange={(e) => updateImage(index, 'alt', e.target.value)}
                        placeholder="Descripción de la imagen"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={image.isPrimary}
                        onChange={(e) => {
                          if (e.target.checked) {
                            // Set all others to false first
                            setFormData(prev => ({
                              ...prev,
                              images: prev.images.map((img, i) => ({ 
                                ...img, 
                                isPrimary: i === index 
                              }))
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">Imagen Principal</span>
                    </label>
                  </div>
                </div>
              ))}
              
              {formData.images.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay imágenes agregadas</p>
                  <p className="text-sm">Haz clic en "Agregar Imagen" para empezar</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Category */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle>Estado y Categoría</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Categoría *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {mockCategories.map(category => (
                    <optgroup key={category.id} label={category.name}>
                      <option value={category.id}>{category.name}</option>
                      {category.subcategories?.map(sub => (
                        <option key={sub.id} value={sub.id}>
                          {category.name} - {sub.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Producto Activo</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Producto Destacado</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle>Etiquetas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Nueva etiqueta"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm" className="hover-glow">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

