import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Palette,
  Ruler,
  Tag,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { colorService, sizeService } from '../../services/firestoreService';
import { showToast } from '../../components/CustomToast';
import type { Color, Size } from '../../services/firestoreService';

const AttributesAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'colors' | 'sizes'>('colors');
  const [searchQuery, setSearchQuery] = useState('');
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // New item forms
  const [newColor, setNewColor] = useState({
    name: '',
    hexCode: '#000000',
    isActive: true
  });

  const [newSize, setNewSize] = useState({
    name: '',
    code: '',
    categoryId: '',
    isActive: true,
    order: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [colorsData, sizesData] = await Promise.all([
        colorService.getAll(),
        sizeService.getAll()
      ]);
      setColors(colorsData);
      setSizes(sizesData);
    } catch (error) {
      console.error('Error loading attributes:', error);
      showToast({
        title: 'Error',
        message: 'Error al cargar los atributos',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateColor = async () => {
    if (!newColor.name.trim()) {
      showToast({
        title: 'Error',
        message: 'El nombre del color es requerido',
        type: 'error'
      });
      return;
    }

    try {
      const colorData = {
        ...newColor,
        name: newColor.name.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await colorService.create(colorData);
      showToast({
        title: 'Color creado',
        message: `El color "${newColor.name}" ha sido creado exitosamente`,
        type: 'success'
      });

      setNewColor({ name: '', hexCode: '#000000', isActive: true });
      loadData();
    } catch (error) {
      console.error('Error creating color:', error);
      showToast({
        title: 'Error',
        message: 'Error al crear el color',
        type: 'error'
      });
    }
  };

  const handleCreateSize = async () => {
    if (!newSize.name.trim() || !newSize.code.trim()) {
      showToast({
        title: 'Error',
        message: 'El nombre y código de la talla son requeridos',
        type: 'error'
      });
      return;
    }

    try {
      const sizeData = {
        ...newSize,
        name: newSize.name.trim(),
        code: newSize.code.trim().toUpperCase(),
        order: sizes.length,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await sizeService.create(sizeData);
      showToast({
        title: 'Talla creada',
        message: `La talla "${newSize.name}" ha sido creada exitosamente`,
        type: 'success'
      });

      setNewSize({ name: '', code: '', categoryId: '', isActive: true, order: 0 });
      loadData();
    } catch (error) {
      console.error('Error creating size:', error);
      showToast({
        title: 'Error',
        message: 'Error al crear la talla',
        type: 'error'
      });
    }
  };

  const handleToggleActive = async (type: 'color' | 'size', id: string, currentStatus: boolean) => {
    try {
      if (type === 'color') {
        await colorService.update(id, { isActive: !currentStatus });
      } else {
        await sizeService.update(id, { isActive: !currentStatus });
      }
      
      showToast({
        title: 'Estado actualizado',
        message: `${type === 'color' ? 'Color' : 'Talla'} ${!currentStatus ? 'activado' : 'desactivado'}`,
        type: 'success'
      });
      
      loadData();
    } catch (error) {
      console.error(`Error toggling ${type}:`, error);
      showToast({
        title: 'Error',
        message: `Error al actualizar el ${type === 'color' ? 'color' : 'talla'}`,
        type: 'error'
      });
    }
  };

  const handleDelete = async (type: 'color' | 'size', id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      if (type === 'color') {
        await colorService.delete(id);
      } else {
        await sizeService.delete(id);
      }
      
      showToast({
        title: `${type === 'color' ? 'Color' : 'Talla'} eliminado`,
        message: `"${name}" ha sido eliminado exitosamente`,
        type: 'success'
      });
      
      loadData();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      showToast({
        title: 'Error',
        message: `Error al eliminar "${name}"`,
        type: 'error'
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredColors = colors.filter(color =>
    color.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSizes = sizes.filter(size =>
    size.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    size.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          Gestión de Atributos
        </h1>
        <p className="text-muted-foreground mt-2">
          Administra los colores, tallas y otros atributos de tus productos
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit animate-scale-in">
        <button
          onClick={() => setActiveTab('colors')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'colors'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Palette className="h-4 w-4 mr-2 inline" />
          Colores
        </button>
        <button
          onClick={() => setActiveTab('sizes')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'sizes'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Ruler className="h-4 w-4 mr-2 inline" />
          Tallas
        </button>
      </div>

      {/* Search */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Buscar ${activeTab === 'colors' ? 'colores' : 'tallas'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div className="space-y-6">
          {/* Add New Color */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2 h-5 w-5" />
                Agregar Nuevo Color
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nombre *</label>
                  <Input
                    placeholder="Ej: Rojo Pasión, Azul Marino"
                    value={newColor.name}
                    onChange={(e) => setNewColor(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Código de Color *</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={newColor.hexCode}
                      onChange={(e) => setNewColor(prev => ({ ...prev, hexCode: e.target.value }))}
                      className="w-16 h-10 p-1 border-2"
                    />
                    <Input
                      placeholder="#000000"
                      value={newColor.hexCode}
                      onChange={(e) => setNewColor(prev => ({ ...prev, hexCode: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleCreateColor} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Color
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Colors List */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                Colores ({filteredColors.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground mt-2">Cargando colores...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredColors.map((color, index) => (
                    <div
                      key={color.id}
                      className="border border-border rounded-lg p-4 hover:shadow-md transition-all animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-border"
                            style={{ backgroundColor: color.hexCode }}
                          />
                          <div>
                            <h3 className="font-medium">{color.name}</h3>
                            <p className="text-sm text-muted-foreground">{color.hexCode}</p>
                          </div>
                        </div>
                        <Badge variant={color.isActive ? 'default' : 'secondary'}>
                          {color.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          Creado: {color.createdAt ? new Date(color.createdAt).toLocaleDateString('es-DO') : 'N/A'}
                        </span>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleToggleActive('color', color.id!, color.isActive)}
                            title={color.isActive ? 'Desactivar' : 'Activar'}
                          >
                            {color.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingItem({ type: 'color', data: color })}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => handleDelete('color', color.id!, color.name)}
                            disabled={deletingId === color.id}
                            title="Eliminar"
                          >
                            {deletingId === color.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && filteredColors.length === 0 && (
                <div className="text-center py-8">
                  <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No se encontraron colores</h3>
                  <p className="text-muted-foreground">Crea tu primer color para comenzar</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sizes Tab */}
      {activeTab === 'sizes' && (
        <div className="space-y-6">
          {/* Add New Size */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2 h-5 w-5" />
                Agregar Nueva Talla
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nombre *</label>
                  <Input
                    placeholder="Ej: Pequeño, Mediano, 42"
                    value={newSize.name}
                    onChange={(e) => setNewSize(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Código *</label>
                  <Input
                    placeholder="Ej: S, M, L, 42"
                    value={newSize.code}
                    onChange={(e) => setNewSize(prev => ({ ...prev, code: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Orden</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={newSize.order}
                    onChange={(e) => setNewSize(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleCreateSize} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Talla
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sizes List */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ruler className="mr-2 h-5 w-5" />
                Tallas ({filteredSizes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground mt-2">Cargando tallas...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSizes.map((size, index) => (
                    <div
                      key={size.id}
                      className="border border-border rounded-lg p-4 hover:shadow-md transition-all animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-bold">
                            {size.code}
                          </div>
                          <div>
                            <h3 className="font-medium">{size.name}</h3>
                            <p className="text-sm text-muted-foreground">Código: {size.code}</p>
                          </div>
                        </div>
                        <Badge variant={size.isActive ? 'default' : 'secondary'}>
                          {size.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          Orden: {size.order}
                        </span>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleToggleActive('size', size.id!, size.isActive)}
                            title={size.isActive ? 'Desactivar' : 'Activar'}
                          >
                            {size.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingItem({ type: 'size', data: size })}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => handleDelete('size', size.id!, size.name)}
                            disabled={deletingId === size.id}
                            title="Eliminar"
                          >
                            {deletingId === size.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && filteredSizes.length === 0 && (
                <div className="text-center py-8">
                  <Ruler className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No se encontraron tallas</h3>
                  <p className="text-muted-foreground">Crea tu primera talla para comenzar</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AttributesAdmin;










