import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { formatPrice } from '../../lib/utils';
import { productService, categoryService } from '../../services/firestoreService';
import { showToast } from '../../components/CustomToast';
import ProductModal from '../../components/ProductModal';
import ProductSheet from '../../components/ProductSheet';
import type { FirestoreProduct, Category } from '../../services/firestoreService';

const ProductsAdmin: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<FirestoreProduct | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Load products and categories
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getActive()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast({
        title: 'Error',
        message: 'Error al cargar los productos',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (product: FirestoreProduct) => {
    const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
    if (totalStock === 0) return { status: 'out', color: 'destructive', text: 'Agotado' };
    if (totalStock <= 5) return { status: 'low', color: 'secondary', text: 'Stock Bajo' };
    return { status: 'good', color: 'default', text: 'En Stock' };
  };

  const handleView = (product: FirestoreProduct) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleEdit = (productId: string) => {
    setEditingProductId(productId);
    setIsProductSheetOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }

    setDeletingProductId(productId);
    try {
      await productService.delete(productId);
      showToast({
        title: 'Producto eliminado',
        message: 'El producto ha sido eliminado exitosamente',
        type: 'success'
      });
      loadData(); // Reload products
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast({
        title: 'Error',
        message: 'Error al eliminar el producto',
        type: 'error'
      });
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleProductSaved = () => {
    loadData(); // Reload products after save
    setIsProductSheetOpen(false);
    setEditingProductId(null);
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Sin categoría';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Gestión de Productos
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra tu catálogo de productos, precios y stock
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingProductId(null);
            setIsProductSheetOpen(true);
          }}
          className="hover-glow animate-scale-in"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      {/* Filters */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="hover-lift">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-sm smooth-transition hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Productos ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Producto</th>
                  <th className="text-left p-4 font-medium">Precio</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-left p-4 font-medium">Destacado</th>
                  <th className="text-right p-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      <p className="text-muted-foreground mt-2">Cargando productos...</p>
                    </td>
                  </tr>
                ) : filteredProducts.map((product, index) => {
                  const stockStatus = getStockStatus(product);
                  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
                  return (
                    <tr 
                      key={product.id} 
                      className={`border-b hover:bg-muted/30 smooth-transition animate-fade-in`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                            {product.images?.[0]?.url ? (
                              <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 smooth-transition"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {getCategoryName(product.categoryId)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{formatPrice(product.price)}</div>
                        {product.compareAtPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.compareAtPrice)}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${
                            stockStatus.status === 'out' ? 'text-red-600' :
                            stockStatus.status === 'low' ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {totalStock}
                          </span>
                          {stockStatus.status === 'out' && <AlertCircle className="h-4 w-4 text-red-500" />}
                          {stockStatus.status === 'low' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                          {stockStatus.status === 'good' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant={product.isActive ? 'default' : 'secondary'}
                          className="animate-scale-in"
                        >
                          {product.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant={product.isFeatured ? 'destructive' : 'outline'}
                          className="animate-scale-in"
                        >
                          {product.isFeatured ? 'Destacado' : 'Normal'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover-lift"
                            onClick={() => handleView(product)}
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover-lift"
                            onClick={() => handleEdit(product.id!)}
                            title="Editar producto"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover-lift text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(product.id!)}
                            disabled={deletingProductId === product.id}
                            title="Eliminar producto"
                          >
                            {deletingProductId === product.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
              <p className="text-muted-foreground mb-4">
                Intenta ajustar los filtros o crear un nuevo producto.
              </p>
              <Button 
                onClick={() => {
                  setEditingProductId(null);
                  setIsProductSheetOpen(true);
                }}
                className="hover-glow"
              >
                <Plus className="mr-2 h-4 w-4" />
                Crear Producto
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Modal */}
      <ProductModal 
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />

      {/* Product Sheet */}
      <ProductSheet 
        isOpen={isProductSheetOpen}
        onClose={() => {
          setIsProductSheetOpen(false);
          setEditingProductId(null);
        }}
        productId={editingProductId}
        onSave={handleProductSaved}
      />
    </div>
  );
};

export default ProductsAdmin;
