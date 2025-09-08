import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FolderOpen,
  Folder,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { mockCategories } from '../../data/mockData';

const CategoriesAdmin: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = mockCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Gestión de Categorías
          </h1>
          <p className="text-muted-foreground mt-2">
            Organiza tus productos en categorías y subcategorías
          </p>
        </div>
        <Link to="/admin/categories/new">
          <Button className="hover-glow animate-scale-in">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar categorías..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, index) => (
          <Card 
            key={category.id} 
            className={`hover-lift animate-scale-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="hover-lift">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <Badge variant={category.isActive ? 'default' : 'secondary'} className="w-fit">
                {category.isActive ? 'Activa' : 'Inactiva'}
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {category.image && (
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover hover:scale-105 smooth-transition"
                  />
                </div>
              )}
              
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>

              {/* Subcategories */}
              {category.subcategories && category.subcategories.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Folder className="h-4 w-4 mr-1" />
                    Subcategorías ({category.subcategories.length})
                  </h4>
                  <div className="space-y-1">
                    {category.subcategories.slice(0, 3).map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{sub.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {sub.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>
                    ))}
                    {category.subcategories.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{category.subcategories.length - 3} más...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm" className="hover-lift">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="hover-lift text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card className="animate-fade-in">
          <CardContent className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No se encontraron categorías</h3>
            <p className="text-muted-foreground mb-4">
              Intenta ajustar la búsqueda o crear una nueva categoría.
            </p>
            <Link to="/admin/categories/new">
              <Button className="hover-glow">
                <Plus className="mr-2 h-4 w-4" />
                Crear Categoría
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CategoriesAdmin;
