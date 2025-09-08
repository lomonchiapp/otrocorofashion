import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Palette,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { mockColors } from '../../data/mockData';

const ColorsAdmin: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredColors = mockColors.filter(color =>
    color.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    color.hex.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Gestión de Colores
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra la paleta de colores disponibles para tus productos
          </p>
        </div>
        <Link to="/admin/colors/new">
          <Button className="hover-glow animate-scale-in">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Color
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar colores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Colors Table */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="mr-2 h-5 w-5" />
            Colores ({filteredColors.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Vista Previa</th>
                  <th className="text-left p-4 font-medium">Nombre</th>
                  <th className="text-left p-4 font-medium">Código Hex</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-right p-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredColors.map((color, index) => (
                  <tr 
                    key={color.id} 
                    className={`border-b hover:bg-muted/30 smooth-transition animate-fade-in`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm hover:scale-110 smooth-transition"
                          style={{ backgroundColor: color.hex }}
                          title={`${color.name} - ${color.hex}`}
                        />
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.hex }}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{color.name}</div>
                    </td>
                    <td className="p-4">
                      <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                        {color.hex.toUpperCase()}
                      </code>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={color.isActive ? 'default' : 'secondary'}
                        className="animate-scale-in flex items-center w-fit"
                      >
                        {color.isActive ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Activo
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Inactivo
                          </>
                        )}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="icon" className="hover-lift">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover-lift text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredColors.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No se encontraron colores</h3>
              <p className="text-muted-foreground mb-4">
                Intenta ajustar la búsqueda o agregar un nuevo color.
              </p>
              <Link to="/admin/colors/new">
                <Button className="hover-glow">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Color
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Color Palette Preview */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader>
          <CardTitle>Paleta de Colores Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 sm:grid-cols-12 lg:grid-cols-16 gap-3">
            {filteredColors.filter(color => color.isActive).map((color, index) => (
              <div 
                key={color.id}
                className={`aspect-square rounded-lg border-2 border-gray-200 hover:scale-110 hover:shadow-lg smooth-transition cursor-pointer animate-scale-in`}
                style={{ 
                  backgroundColor: color.hex,
                  animationDelay: `${index * 0.05}s`
                }}
                title={`${color.name} - ${color.hex}`}
              />
            ))}
          </div>
          {filteredColors.filter(color => color.isActive).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No hay colores activos para mostrar
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorsAdmin;
