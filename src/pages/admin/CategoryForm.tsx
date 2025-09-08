import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Eye,
  FolderOpen,
  Plus,
  Trash2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { mockCategories } from '../../data/mockData';

interface SubcategoryData {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
}

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId: string;
  isActive: boolean;
  subcategories: SubcategoryData[];
}

const CategoryForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    image: '',
    parentId: '',
    isActive: true,
    subcategories: []
  });

  const handleInputChange = (field: keyof CategoryFormData, value: any) => {
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

  const addSubcategory = () => {
    setFormData(prev => ({
      ...prev,
      subcategories: [...prev.subcategories, {
        name: '',
        slug: '',
        description: '',
        isActive: true
      }]
    }));
  };

  const updateSubcategory = (index: number, field: keyof SubcategoryData, value: any) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.map((sub, i) => {
        if (i === index) {
          const updated = { ...sub, [field]: value };
          // Auto-generate slug for subcategory
          if (field === 'name') {
            updated.slug = value.toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim();
          }
          return updated;
        }
        return sub;
      })
    }));
  };

  const removeSubcategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would integrate with Firebase
      console.log('Category data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubcategory = !!formData.parentId;
  const parentCategories = mockCategories.filter(cat => !cat.parentId);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/categories')}
            className="hover-lift"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Categorías
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Nueva Categoría
            </h1>
            <p className="text-muted-foreground">
              Completa la información de la categoría
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
                Guardar Categoría
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
              <CardTitle className="flex items-center">
                <FolderOpen className="h-5 w-5 mr-2" />
                Información Básica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nombre de la Categoría *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Mujer, Hombre, Accesorios"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Slug (URL)</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="mujer-ropa"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descripción de la categoría..."
                  className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Imagen de la Categoría</label>
                <div className="flex gap-3">
                  <Input
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  <Button type="button" variant="outline" className="hover-lift">
                    <Upload className="h-4 w-4 mr-2" />
                    Subir
                  </Button>
                </div>
                {formData.image && (
                  <div className="mt-3">
                    <img
                      src={formData.image}
                      alt="Vista previa"
                      className="w-32 h-24 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Subcategories - Only show for main categories */}
          {!isSubcategory && (
            <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Subcategorías</CardTitle>
                  <Button type="button" onClick={addSubcategory} size="sm" className="hover-glow">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Subcategoría
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.subcategories.map((subcategory, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3 hover-lift">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Subcategoría {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSubcategory(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium mb-1 block">Nombre</label>
                        <Input
                          value={subcategory.name}
                          onChange={(e) => updateSubcategory(index, 'name', e.target.value)}
                          placeholder="Ej: Vestidos, Blusas"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Slug</label>
                        <Input
                          value={subcategory.slug}
                          onChange={(e) => updateSubcategory(index, 'slug', e.target.value)}
                          placeholder="vestidos"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium mb-1 block">Descripción</label>
                      <Input
                        value={subcategory.description}
                        onChange={(e) => updateSubcategory(index, 'description', e.target.value)}
                        placeholder="Descripción de la subcategoría"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={subcategory.isActive}
                          onChange={(e) => updateSubcategory(index, 'isActive', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Activa</span>
                      </label>
                    </div>
                  </div>
                ))}
                
                {formData.subcategories.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay subcategorías agregadas</p>
                    <p className="text-sm">Las subcategorías son opcionales</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Parent Category - Only show when creating subcategory */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Categoría Padre</label>
                <select
                  value={formData.parentId}
                  onChange={(e) => handleInputChange('parentId', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Categoría Principal</option>
                  {parentCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Deja vacío para crear una categoría principal
                </p>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Categoría Activa</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {formData.name && (
            <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle>Vista Previa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  {formData.image && (
                    <div className="aspect-video bg-muted">
                      <img
                        src={formData.image}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{formData.name}</h3>
                      <Badge variant={formData.isActive ? 'default' : 'secondary'}>
                        {formData.isActive ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </div>
                    {formData.description && (
                      <p className="text-sm text-muted-foreground">
                        {formData.description}
                      </p>
                    )}
                    {formData.subcategories.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium mb-2">
                          Subcategorías ({formData.subcategories.length})
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {formData.subcategories.slice(0, 3).map((sub, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {sub.name}
                            </Badge>
                          ))}
                          {formData.subcategories.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{formData.subcategories.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;

