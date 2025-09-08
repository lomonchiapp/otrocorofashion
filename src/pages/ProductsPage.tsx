import React, { useState, useMemo } from 'react';
import { Filter, Grid, List, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import ProductCard from '../components/ProductCard';
import { mockProducts, mockCategories, mockColors, mockSizes } from '../data/mockData';
import type { ProductFilters } from '../types';

const ProductsPage: React.FC = () => {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'newest'>('newest');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...mockProducts];

    // Aplicar filtros
    if (filters.categoryId) {
      filtered = filtered.filter(product => 
        product.categoryId === filters.categoryId ||
        product.categoryId.startsWith(filters.categoryId + '-')
      );
    }

    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter(product =>
        product.availableColors.some(color => filters.colors?.includes(color.id))
      );
    }

    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.availableSizes.some(size => filters.sizes?.includes(size.id))
      );
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(product => product.basePrice >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.basePrice <= filters.maxPrice!);
    }

    if (filters.isFeatured) {
      filtered = filtered.filter(product => product.isFeatured);
    }

    if (filters.inStock) {
      filtered = filtered.filter(product => product.stockTotal > 0);
    }

    if (filters.rating !== undefined) {
      filtered = filtered.filter(product => product.rating >= filters.rating!);
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.basePrice - b.basePrice;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'newest':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [filters, sortBy, sortOrder]);

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== null && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Todos los Productos</h1>
        <p className="text-muted-foreground">
          Descubre nuestra colección completa de moda
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filtros</h3>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Limpiar ({activeFiltersCount})
                  </Button>
                )}
              </div>

              {/* Categories Filter */}
              <div className="space-y-2 mb-6">
                <h4 className="font-medium text-sm">Categorías</h4>
                <div className="space-y-2">
                  {mockCategories.map(category => (
                    <div key={category.id}>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={filters.categoryId === category.id}
                          onChange={() => handleFilterChange('categoryId', category.id)}
                          className="text-primary"
                        />
                        <span className="text-sm">{category.name}</span>
                      </label>
                      {category.subcategories && filters.categoryId === category.id && (
                        <div className="ml-6 mt-2 space-y-1">
                          {category.subcategories.map(sub => (
                            <label key={sub.id} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name="category"
                                checked={filters.categoryId === sub.id}
                                onChange={() => handleFilterChange('categoryId', sub.id)}
                                className="text-primary"
                              />
                              <span className="text-sm">{sub.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors Filter */}
              <div className="space-y-2 mb-6">
                <h4 className="font-medium text-sm">Colores</h4>
                <div className="grid grid-cols-4 gap-2">
                  {mockColors.map(color => (
                    <label key={color.id} className="cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.colors?.includes(color.id) || false}
                        onChange={(e) => {
                          const currentColors = filters.colors || [];
                          if (e.target.checked) {
                            handleFilterChange('colors', [...currentColors, color.id]);
                          } else {
                            handleFilterChange('colors', currentColors.filter(id => id !== color.id));
                          }
                        }}
                        className="sr-only"
                      />
                      <div
                        className={`w-8 h-8 rounded-full border-2 ${
                          filters.colors?.includes(color.id) ? 'border-primary' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Sizes Filter */}
              <div className="space-y-2 mb-6">
                <h4 className="font-medium text-sm">Tallas</h4>
                <div className="grid grid-cols-3 gap-2">
                  {mockSizes.map(size => (
                    <label key={size.id} className="cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.sizes?.includes(size.id) || false}
                        onChange={(e) => {
                          const currentSizes = filters.sizes || [];
                          if (e.target.checked) {
                            handleFilterChange('sizes', [...currentSizes, size.id]);
                          } else {
                            handleFilterChange('sizes', currentSizes.filter(id => id !== size.id));
                          }
                        }}
                        className="sr-only"
                      />
                      <div
                        className={`px-3 py-2 text-center text-sm border rounded ${
                          filters.sizes?.includes(size.id)
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-gray-200 hover:border-primary'
                        }`}
                      >
                        {size.abbreviation}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-2 mb-6">
                <h4 className="font-medium text-sm">Precio</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="50000"
                    max="500000"
                    step="10000"
                    value={filters.maxPrice || 500000}
                    onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>$50.000</span>
                    <span>${(filters.maxPrice || 500000).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Other Filters */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.isFeatured || false}
                    onChange={(e) => handleFilterChange('isFeatured', e.target.checked || undefined)}
                    className="text-primary"
                  />
                  <span className="text-sm">Solo destacados</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock || false}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked || undefined)}
                    className="text-primary"
                  />
                  <span className="text-sm">Solo disponibles</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              {filteredAndSortedProducts.length} productos encontrados
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm">Ordenar por:</span>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split('-');
                    setSortBy(sort as typeof sortBy);
                    setSortOrder(order as typeof sortOrder);
                  }}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="newest-desc">Más recientes</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="name-asc">Nombre: A-Z</option>
                  <option value="name-desc">Nombre: Z-A</option>
                  <option value="rating-desc">Mejor calificados</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex border rounded">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No se encontraron productos con los filtros seleccionados
              </p>
              <Button onClick={clearFilters}>Limpiar filtros</Button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredAndSortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className={viewMode === 'list' ? 'flex flex-row' : ''}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
