import React, { useState, useEffect } from 'react';
import { X, Save, FolderPlus, Folder } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { categoryService } from '../services/firestoreService';
import { showToast } from './CustomToast';
import type { Category } from '../services/firestoreService';

interface QuickCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: (category: any) => void;
  parentCategoryId?: string | null;
}

const QuickCategoryModal: React.FC<QuickCategoryModalProps> = ({
  isOpen,
  onClose,
  onCategoryCreated,
  parentCategoryId
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      setSelectedParentId(parentCategoryId || null);
    }
  }, [isOpen, parentCategoryId]);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      showToast({
        title: 'Error',
        message: 'El nombre de la categoría es requerido',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const categoryData: any = {
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
        isActive: true,
        order: categories.filter(c => c.parentId === selectedParentId).length,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Solo agregar campos opcionales si tienen valor
      if (description.trim()) {
        categoryData.description = description.trim();
      }
      
      if (selectedParentId) {
        categoryData.parentId = selectedParentId;
      }

      const categoryId = await categoryService.create(categoryData);
      const newCategory = { id: categoryId, ...categoryData };
      
      onCategoryCreated(newCategory);
      showToast({
        title: 'Categoría creada',
        message: `La categoría "${name}" ha sido creada exitosamente`,
        type: 'success'
      });
      
      // Reset form
      setName('');
      setDescription('');
      setSelectedParentId(null);
      onClose();
    } catch (error) {
      console.error('Error creating category:', error);
      showToast({
        title: 'Error',
        message: 'Error al crear la categoría',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedParentId(null);
    onClose();
  };

  const getRootCategories = () => {
    return categories.filter(c => !c.parentId);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-in fade-in-0"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <FolderPlus className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Nueva Categoría</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Categoría Padre (Opcional)
              </label>
              <select
                className="w-full p-3 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                value={selectedParentId || ''}
                onChange={(e) => setSelectedParentId(e.target.value || null)}
              >
                <option value="">Categoría Principal</option>
                {getRootCategories().map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {selectedParentId && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    <Folder className="h-3 w-3 mr-1" />
                    Subcategoría de: {categories.find(c => c.id === selectedParentId)?.name}
                  </Badge>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Nombre de la Categoría *
              </label>
              <Input
                placeholder="Ej: Vestidos, Camisas, Accesorios"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Descripción (Opcional)
              </label>
              <Input
                placeholder="Breve descripción de la categoría"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>Creando...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Crear Categoría
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default QuickCategoryModal;
