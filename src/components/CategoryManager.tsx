import React, { useState, useEffect } from 'react';
import { 
  FolderPlus, 
  Folder, 
  FolderOpen,
  Plus, 
  ChevronRight,
  ChevronDown,
  Edit,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { categoryService } from '../services/firestoreService';
import { showToast } from './CustomToast';
import type { Category } from '../services/firestoreService';

interface CategoryManagerProps {
  selectedCategoryId?: string;
  onCategorySelect: (categoryId: string) => void;
  onCategoryCreated?: (category: Category) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  selectedCategoryId,
  onCategorySelect,
  onCategoryCreated
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryParent, setNewCategoryParent] = useState<string | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      showToast({
        title: 'Error',
        message: 'Error al cargar las categorías',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const buildCategoryTree = (parentId: string | null = null): Category[] => {
    return categories
      .filter(cat => {
        // Para categorías principales (sin padre)
        if (parentId === null) {
          return !cat.parentId || cat.parentId === null;
        }
        // Para subcategorías
        return cat.parentId === parentId;
      })
      .sort((a, b) => a.order - b.order);
  };

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      showToast({
        title: 'Error',
        message: 'El nombre de la categoría es requerido',
        type: 'error'
      });
      return;
    }

    try {
      const categoryData: any = {
        name: newCategoryName.trim(),
        slug: newCategoryName.trim().toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, ''),
        isActive: true,
        order: categories.filter(c => c.parentId === newCategoryParent).length,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Solo agregar parentId si realmente hay un padre (subcategoría)
      if (newCategoryParent) {
        categoryData.parentId = newCategoryParent;
      }

      const categoryId = await categoryService.create(categoryData);
      const newCategory = { id: categoryId, ...categoryData };
      
      setCategories(prev => [...prev, newCategory]);
      onCategoryCreated?.(newCategory);
      
      // Reset form
      setNewCategoryName('');
      setNewCategoryParent(null);
      setIsCreatingCategory(false);
      
      showToast({
        title: 'Categoría creada',
        message: `"${newCategoryName}" ha sido creada exitosamente`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error creating category:', error);
      showToast({
        title: 'Error',
        message: 'Error al crear la categoría',
        type: 'error'
      });
    }
  };

  const renderCategoryItem = (category: Category, depth: number = 0) => {
    const hasChildren = categories.some(cat => cat.parentId === category.id);
    const isExpanded = expandedCategories.has(category.id!);
    const isSelected = selectedCategoryId === category.id;

    return (
      <div key={category.id}>
        <div
          className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-all hover:bg-muted/50 ${
            isSelected ? 'bg-primary/10 border border-primary/20' : ''
          }`}
          style={{ marginLeft: `${depth * 20}px` }}
        >
          <div className="flex items-center space-x-2 flex-1">
            {hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => toggleExpanded(category.id!)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            ) : (
              <div className="w-6" />
            )}

            <div
              className="flex items-center space-x-2 flex-1"
              onClick={() => onCategorySelect(category.id!)}
            >
              {hasChildren ? (
                isExpanded ? <FolderOpen className="h-4 w-4 text-primary" /> : <Folder className="h-4 w-4 text-primary" />
              ) : (
                <div className="w-4 h-4 bg-muted rounded border" />
              )}
              <span className={`text-sm ${isSelected ? 'font-medium text-primary' : ''}`}>
                {category.name}
              </span>
              {!category.isActive && (
                <Badge variant="secondary" className="text-xs">Inactivo</Badge>
              )}
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setNewCategoryParent(category.id!);
                  setIsCreatingCategory(true);
                }}
                title="Agregar subcategoría"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {buildCategoryTree(category.id).map(child => 
              renderCategoryItem(child, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        <p className="text-sm text-muted-foreground mt-2">Cargando categorías...</p>
      </div>
    );
  }

  const rootCategories = buildCategoryTree(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <FolderPlus className="mr-2 h-5 w-5" />
            Categorías
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setNewCategoryParent(null);
              setIsCreatingCategory(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Nueva
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create Category Form */}
        {isCreatingCategory && (
          <div className="border border-dashed border-primary/50 rounded-lg p-4 bg-primary/5">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Crear en:</span>
                {newCategoryParent ? (
                  <Badge variant="outline">
                    {categories.find(c => c.id === newCategoryParent)?.name} (Subcategoría)
                  </Badge>
                ) : (
                  <Badge variant="outline">Categoría Principal</Badge>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  placeholder="Nombre de la categoría"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()}
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={handleCreateCategory}
                  disabled={!newCategoryName.trim()}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCreatingCategory(false);
                    setNewCategoryName('');
                    setNewCategoryParent(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Category Tree */}
        <div className="space-y-1 max-h-64 overflow-y-auto border border-border rounded-lg p-2 group">
          {rootCategories.length === 0 ? (
            <div className="text-center py-8">
              <Folder className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No hay categorías</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setNewCategoryParent(null);
                  setIsCreatingCategory(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Crear Primera Categoría
              </Button>
            </div>
          ) : (
            rootCategories.map(category => renderCategoryItem(category))
          )}
        </div>

        {/* Selected Category Info */}
        {selectedCategoryId && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Categoría seleccionada:</span>
              <Badge variant="default">
                {categories.find(c => c.id === selectedCategoryId)?.name}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCategorySelect('')}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Category Hierarchy Helper */}
        <div className="text-xs text-muted-foreground bg-muted/30 rounded p-2">
          <p className="font-medium mb-1">💡 Organización de categorías:</p>
          <ul className="space-y-1">
            <li>• <strong>Categorías principales:</strong> Mujer, Hombre, Accesorios</li>
            <li>• <strong>Subcategorías:</strong> Vestidos, Camisas, Zapatos, etc.</li>
            <li>• Click en ▶ para expandir y ver subcategorías</li>
            <li>• Click en + para agregar subcategoría a cualquier nivel</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
