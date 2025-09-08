import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Palette,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

interface ColorFormData {
  name: string;
  hex: string;
  isActive: boolean;
}

const ColorForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState<ColorFormData>({
    name: '',
    hex: '#000000',
    isActive: true
  });

  const handleInputChange = (field: keyof ColorFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHexChange = (hex: string) => {
    // Ensure hex starts with #
    if (!hex.startsWith('#')) {
      hex = '#' + hex;
    }
    
    // Validate hex format
    const isValidHex = /^#[0-9A-F]{6}$/i.test(hex);
    if (isValidHex || hex === '#') {
      setFormData(prev => ({ ...prev, hex }));
    }
  };

  const copyHexCode = () => {
    navigator.clipboard.writeText(formData.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateRandomColor = () => {
    const randomHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setFormData(prev => ({ ...prev, hex: randomHex }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would integrate with Firebase
      console.log('Color data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      navigate('/admin/colors');
    } catch (error) {
      console.error('Error saving color:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Predefined colors for quick selection
  const predefinedColors = [
    { name: 'Negro', hex: '#000000' },
    { name: 'Blanco', hex: '#FFFFFF' },
    { name: 'Rojo', hex: '#DC2626' },
    { name: 'Azul', hex: '#2563EB' },
    { name: 'Verde', hex: '#059669' },
    { name: 'Amarillo', hex: '#EAB308' },
    { name: 'Rosa', hex: '#EC4899' },
    { name: 'Púrpura', hex: '#9333EA' },
    { name: 'Gris', hex: '#6B7280' },
    { name: 'Naranja', hex: '#EA580C' },
    { name: 'Turquesa', hex: '#06B6D4' },
    { name: 'Lima', hex: '#65A30D' },
  ];

  const getContrastColor = (hex: string) => {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  const isValidHex = /^#[0-9A-F]{6}$/i.test(formData.hex);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/colors')}
            className="hover-lift"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Colores
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Nuevo Color
            </h1>
            <p className="text-muted-foreground">
              Agrega un nuevo color a la paleta
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleSubmit}
          disabled={isLoading || !formData.name || !isValidHex}
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
              Guardar Color
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-6">
          <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Información del Color
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nombre del Color *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ej: Rojo Carmesí, Azul Marino"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Código Hexadecimal *</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          value={formData.hex}
                          onChange={(e) => handleHexChange(e.target.value)}
                          placeholder="#000000"
                          className="pr-20"
                          required
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                          <div
                            className="w-6 h-6 rounded border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: isValidHex ? formData.hex : '#ccc' }}
                            title="Color actual"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={copyHexCode}
                            className="h-6 w-6"
                          >
                            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                      <input
                        type="color"
                        value={isValidHex ? formData.hex : '#000000'}
                        onChange={(e) => handleHexChange(e.target.value)}
                        className="w-12 h-10 border border-input rounded cursor-pointer"
                        title="Selector de color"
                      />
                    </div>
                    {!isValidHex && formData.hex && (
                      <p className="text-sm text-red-500 mt-1">
                        Formato inválido. Use #RRGGBB (ej: #FF0000)
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Color Activo</span>
                    </label>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateRandomColor}
                      className="hover-lift"
                    >
                      Color Aleatorio
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Predefined Colors */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle>Colores Predefinidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {predefinedColors.map((color, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        name: color.name,
                        hex: color.hex
                      }));
                    }}
                    className="group relative aspect-square rounded-lg border-2 border-gray-200 hover:border-primary transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} - ${color.hex}`}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors duration-200" />
                    <div 
                      className="absolute bottom-1 left-1 right-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 truncate px-1"
                      style={{ color: getContrastColor(color.hex) }}
                    >
                      {color.name}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Large Color Preview */}
              <div className="aspect-square rounded-lg border-2 border-gray-200 overflow-hidden">
                <div
                  className="w-full h-full flex items-center justify-center text-2xl font-bold transition-all duration-300"
                  style={{ 
                    backgroundColor: isValidHex ? formData.hex : '#ccc',
                    color: isValidHex ? getContrastColor(formData.hex) : '#666'
                  }}
                >
                  {formData.name || 'Nombre del Color'}
                </div>
              </div>
              
              {/* Color Information */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Nombre:</span>
                  <span className="text-sm">{formData.name || 'Sin nombre'}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Hex:</span>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {formData.hex}
                  </code>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estado:</span>
                  <Badge variant={formData.isActive ? 'default' : 'secondary'} className="flex items-center gap-1">
                    {formData.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {formData.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
              
              {/* Usage Examples */}
              {isValidHex && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Ejemplos de Uso:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div 
                      className="aspect-square rounded border flex items-center justify-center text-xs"
                      style={{ backgroundColor: formData.hex, color: getContrastColor(formData.hex) }}
                    >
                      Fondo
                    </div>
                    <div 
                      className="aspect-square rounded border flex items-center justify-center text-xs"
                      style={{ backgroundColor: 'white', color: formData.hex, borderColor: formData.hex }}
                    >
                      Texto
                    </div>
                    <div 
                      className="aspect-square rounded border-2 flex items-center justify-center text-xs"
                      style={{ borderColor: formData.hex, color: formData.hex }}
                    >
                      Borde
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ColorForm;

