import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Upload,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Package,
  Eye,
  EyeOff,
  FolderPlus
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from './ui/sheet';
import { productService, categoryService, colorService, sizeService } from '../services/firestoreService';
import { showToast } from './CustomToast';
import CategoryManager from './CategoryManager';
import QuickColorModal from './QuickColorModal';
import QuickSizeModal from './QuickSizeModal';
import type { FirestoreProduct, Category, Color, Size } from '../services/firestoreService';

interface ProductSheetProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string | null;
  onSave?: () => void;
}

const ProductSheet: React.FC<ProductSheetProps> = ({ isOpen, onClose, productId, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  
  // Quick creation modals
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<FirestoreProduct>>({
    name: '',
    description: '',
    price: 0,
    compareAtPrice: 0,
    categoryId: '',
    tags: [],
    isActive: true,
    isFeatured: false,
    seo: {
      title: '',
      description: '',
      keywords: []
    },
    variants: [],
    images: []
  });

  const [newTag, setNewTag] = useState('');
  const [newVariant, setNewVariant] = useState({
    sku: '',
    colorId: '',
    sizeId: '',
    price: 0,
    compareAtPrice: 0,
    stock: 0,
    isActive: true,
    images: []
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, colorsData, sizesData] = await Promise.all([
          categoryService.getActive(),
          colorService.getActive(),
          sizeService.getActive()
        ]);

        setCategories(categoriesData);
        setColors(colorsData);
        setSizes(sizesData);

        // Load product data if editing
        if (productId) {
          const product = await productService.getById(productId);
          if (product) {
            setFormData(product);
          }
        }
              } catch (error) {
          console.error('Error loading data:', error);
          showToast({
            title: 'Error',
            message: 'Error al cargar los datos',
            type: 'error'
          });
        }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen, productId]);

  // Reset form when closing
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        description: '',
        price: 0,
        compareAtPrice: 0,
        categoryId: '',
        tags: [],
        isActive: true,
        isFeatured: false,
        seo: {
          title: '',
          description: '',
          keywords: []
        },
        variants: [],
        images: []
      });
      setNewTag('');
      setNewVariant({
        sku: '',
        colorId: '',
        sizeId: '',
        price: 0,
        compareAtPrice: 0,
        stock: 0,
        isActive: true,
        images: []
      });
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSeoChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value
      }
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const addVariant = () => {
    // Validación mejorada
    if (!newVariant.sku.trim()) {
      showToast({
        title: 'Error',
        message: 'El SKU es requerido',
        type: 'error'
      });
      return;
    }

    if (!newVariant.colorId) {
      showToast({
        title: 'Error',
        message: 'Selecciona un color',
        type: 'error'
      });
      return;
    }

    if (!newVariant.sizeId) {
      showToast({
        title: 'Error',
        message: 'Selecciona una talla',
        type: 'error'
      });
      return;
    }

    // Verificar SKU duplicado
    const existingSku = formData.variants?.find(v => v.sku === newVariant.sku.trim());
    if (existingSku) {
      showToast({
        title: 'Error',
        message: 'Ya existe una variante con ese SKU',
        type: 'error'
      });
      return;
    }

    // Verificar combinación color/talla duplicada
    const existingCombo = formData.variants?.find(v => 
      v.colorId === newVariant.colorId && v.sizeId === newVariant.sizeId
    );
    if (existingCombo) {
      showToast({
        title: 'Error',
        message: 'Ya existe una variante con esa combinación de color y talla',
        type: 'error'
      });
      return;
    }

    const variant = {
      ...newVariant,
      id: Date.now().toString(),
      sku: newVariant.sku.trim(),
      price: newVariant.price || formData.price || 0,
      stock: newVariant.stock || 0
    };

    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), variant]
    }));

    // Reset form
    setNewVariant({
      sku: '',
      colorId: '',
      sizeId: '',
      price: formData.price || 0,
      compareAtPrice: 0,
      stock: 0,
      isActive: true,
      images: []
    });

    showToast({
      title: 'Variante agregada',
      message: 'La variante ha sido agregada exitosamente',
      type: 'success'
    });
  };

  const removeVariant = (variantId: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants?.filter(v => v.id !== variantId) || []
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.categoryId) {
      showToast({
        title: 'Error',
        message: 'Por favor completa los campos requeridos (nombre y categoría)',
        type: 'error'
      });
      return;
    }

    if (!formData.variants || formData.variants.length === 0) {
      showToast({
        title: 'Error',
        message: 'Debes agregar al menos una variante del producto',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      if (productId) {
        // Update existing product
        await productService.update(productId, formData);
        showToast({
          title: 'Producto actualizado',
          message: `${formData.name} ha sido actualizado exitosamente`,
          type: 'success'
        });
      } else {
        // Create new product
        await productService.create(formData as Omit<FirestoreProduct, 'id'>);
        showToast({
          title: 'Producto creado',
          message: `${formData.name} ha sido creado exitosamente`,
          type: 'success'
        });
      }

      onSave?.();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      showToast({
        title: 'Error',
        message: 'Error al guardar el producto',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setFormData(prev => ({ ...prev, categoryId }));
  };

  const handleCategoryCreated = (newCategory: Category) => {
    setCategories(prev => [...prev, newCategory]);
    setFormData(prev => ({ ...prev, categoryId: newCategory.id }));
  };

  const handleColorCreated = (newColor: Color) => {
    setColors(prev => [...prev, newColor]);
    setNewVariant(prev => ({ ...prev, colorId: newColor.id! }));
  };

  const handleSizeCreated = (newSize: Size) => {
    setSizes(prev => [...prev, newSize]);
    setNewVariant(prev => ({ ...prev, sizeId: newSize.id! }));
  };

  const getColorName = (colorId: string) => {
    return colors.find(c => c.id === colorId)?.name || 'Color desconocido';
  };

  const getSizeName = (sizeId: string) => {
    return sizes.find(s => s.id === sizeId)?.name || 'Talla desconocida';
  };

  return (
    <>
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full min-w-[40%] max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {productId ? 'Editar Producto' : 'Nuevo Producto'}
          </SheetTitle>
          <SheetDescription>
            {productId ? 'Modifica los detalles del producto' : 'Crea un nuevo producto para tu tienda'}
          </SheetDescription>
        </SheetHeader>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Información Básica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Nombre del Producto *
                </label>
                <Input
                  placeholder="Ej: Vestido Elegante de Verano"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Descripción
                </label>
                <textarea
                  className="w-full min-h-[100px] p-3 text-sm border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="Describe las características, materiales, cuidados, etc."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Precio *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pl-10"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Precio Comparativo
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pl-10"
                      value={formData.compareAtPrice}
                      onChange={(e) => handleInputChange('compareAtPrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              {/* Category Manager */}
              <CategoryManager
                selectedCategoryId={formData.categoryId}
                onCategorySelect={handleCategorySelect}
                onCategoryCreated={handleCategoryCreated}
              />

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="rounded border-input"
                  />
                  <span className="text-sm">Producto activo</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    className="rounded border-input"
                  />
                  <span className="text-sm">Producto destacado</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="mr-2 h-5 w-5" />
                Etiquetas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Agregar etiqueta"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Images Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="mr-2 h-5 w-5" />
                Gestión de Imágenes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                Las imágenes se pueden organizar por colores específicos o como imágenes generales del producto.
              </div>

              {/* General Product Images */}
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-medium mb-3">Imágenes Generales del Producto</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {formData.images?.filter(img => !img.colorId).map((image, index) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const updatedImages = formData.images?.filter(img => img.id !== image.id) || [];
                            handleInputChange('images', updatedImages);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      {image.isPrimary && (
                        <Badge className="absolute bottom-2 left-2 text-xs">Principal</Badge>
                      )}
                    </div>
                  ))}
                  
                  {/* Add General Image Button */}
                  <div className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <div className="text-center">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Agregar imagen</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Images by Color */}
              {colors.length > 0 && (
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Imágenes por Color</h4>
                  <div className="space-y-4">
                    {colors.map((color) => {
                      const colorImages = formData.images?.filter(img => img.colorId === color.id) || [];
                      return (
                        <div key={color.id} className="border border-border rounded-lg p-3">
                          <div className="flex items-center mb-3">
                            <div 
                              className="w-4 h-4 rounded-full mr-2 border border-border"
                              style={{ backgroundColor: color.hexCode }}
                            />
                            <span className="font-medium text-sm">{color.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              ({colorImages.length} imágenes)
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {colorImages.map((image) => (
                              <div key={image.id} className="relative group">
                                <div className="aspect-square bg-muted rounded flex items-center justify-center">
                                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    const updatedImages = formData.images?.filter(img => img.id !== image.id) || [];
                                    handleInputChange('images', updatedImages);
                                  }}
                                  className="absolute -top-1 -right-1 h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-2 w-2" />
                                </Button>
                              </div>
                            ))}
                            
                            {/* Add Color Image Button */}
                            <div className="aspect-square border border-dashed border-border rounded flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                              <Plus className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Variantes del Producto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Variants */}
              {formData.variants?.map((variant) => (
                <div key={variant.id} className="border border-border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{variant.sku}</Badge>
                      <Badge>{getColorName(variant.colorId)}</Badge>
                      <Badge variant="secondary">{getSizeName(variant.sizeId)}</Badge>
                      <span className="text-sm font-medium">RD${variant.price}</span>
                      <span className="text-sm text-muted-foreground">Stock: {variant.stock}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInputChange('variants', 
                          formData.variants?.map(v => 
                            v.id === variant.id ? { ...v, isActive: !v.isActive } : v
                          )
                        )}
                      >
                        {variant.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(variant.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Variant */}
              <div className="border border-dashed border-border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">Agregar Nueva Variante</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">SKU *</label>
                    <Input
                      placeholder="Ej: VES-001-ROJ-M"
                      value={newVariant.sku}
                      onChange={(e) => setNewVariant(prev => ({ ...prev, sku: e.target.value }))}
                      className={!newVariant.sku.trim() && newVariant.colorId && newVariant.sizeId ? 'border-red-300' : ''}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Stock *</label>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      value={newVariant.stock}
                      onChange={(e) => setNewVariant(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Color *</label>
                    <div className="flex items-center space-x-2">
                      <select
                        className="flex-1 p-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        value={newVariant.colorId}
                        onChange={(e) => setNewVariant(prev => ({ ...prev, colorId: e.target.value }))}
                      >
                        <option value="">Seleccionar color</option>
                        {colors.map((color) => (
                          <option key={color.id} value={color.id}>
                            {color.name}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setIsColorModalOpen(true)}
                        className="px-2"
                        title="Crear nuevo color"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Talla *</label>
                    <div className="flex items-center space-x-2">
                      <select
                        className="flex-1 p-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        value={newVariant.sizeId}
                        onChange={(e) => setNewVariant(prev => ({ ...prev, sizeId: e.target.value }))}
                      >
                        <option value="">Seleccionar talla</option>
                        {sizes.map((size) => (
                          <option key={size.id} value={size.id}>
                            {size.name}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setIsSizeModalOpen(true)}
                        className="px-2"
                        title="Crear nueva talla"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Precio Específico (Opcional)</label>
                    <Input
                      type="number"
                      placeholder={`Por defecto: ${formData.price || 0}`}
                      min="0"
                      step="0.01"
                      value={newVariant.price || ''}
                      onChange={(e) => setNewVariant(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Deja vacío para usar el precio base del producto
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Precio Comparativo</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={newVariant.compareAtPrice || ''}
                      onChange={(e) => setNewVariant(prev => ({ ...prev, compareAtPrice: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <Button onClick={addVariant} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Variante
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border p-6">
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>Guardando...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {productId ? 'Actualizar' : 'Crear'} Producto
                </>
              )}
            </Button>
          </div>
        </div>

      </SheetContent>
    </Sheet>

    {/* Quick Color Modal */}
    <QuickColorModal
      isOpen={isColorModalOpen}
      onClose={() => setIsColorModalOpen(false)}
      onColorCreated={handleColorCreated}
    />

    {/* Quick Size Modal */}
    <QuickSizeModal
      isOpen={isSizeModalOpen}
      onClose={() => setIsSizeModalOpen(false)}
      onSizeCreated={handleSizeCreated}
    />
  </>
  );
};

export default ProductSheet;
