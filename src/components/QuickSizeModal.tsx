import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Ruler } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { sizeService } from '../services/firestoreService';
import { showToast } from './CustomToast';
import type { Size } from '../services/firestoreService';

interface QuickSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSizeCreated: (size: Size) => void;
}

const QuickSizeModal: React.FC<QuickSizeModalProps> = ({ isOpen, onClose, onSizeCreated }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !code.trim()) {
      showToast({
        title: 'Error',
        message: 'El nombre y código de la talla son requeridos',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const sizeData: any = {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        isActive: true,
        order: 0, // Default order
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const sizeId = await sizeService.create(sizeData);
      const newSize = { id: sizeId, ...sizeData };
      
      onSizeCreated(newSize);
      showToast({
        title: 'Talla creada',
        message: `${name} (${code}) ha sido creada exitosamente`,
        type: 'success'
      });
      
      // Reset form
      setName('');
      setCode('');
      onClose();
    } catch (error) {
      console.error('Error creating size:', error);
      showToast({
        title: 'Error',
        message: 'Error al crear la talla',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setCode('');
    onClose();
  };

  // Predefined size suggestions
  const sizePresets = [
    { name: 'Extra Pequeño', code: 'XS' },
    { name: 'Pequeño', code: 'S' },
    { name: 'Mediano', code: 'M' },
    { name: 'Grande', code: 'L' },
    { name: 'Extra Grande', code: 'XL' },
    { name: 'Extra Extra Grande', code: 'XXL' },
    { name: 'Talla 36', code: '36' },
    { name: 'Talla 37', code: '37' },
    { name: 'Talla 38', code: '38' },
    { name: 'Talla 39', code: '39' },
    { name: 'Talla 40', code: '40' },
    { name: 'Talla 41', code: '41' },
    { name: 'Talla 42', code: '42' }
  ];

  const handlePresetClick = (preset: { name: string; code: string }) => {
    setName(preset.name);
    setCode(preset.code);
  };

  if (!isOpen) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] animate-in fade-in-0"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-background border border-border rounded-lg shadow-2xl z-[9999] animate-in zoom-in-95 duration-200 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Ruler className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Crear Talla</h3>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nombre de la Talla *</label>
              <Input
                placeholder="Ej: Mediano"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Código *</label>
              <Input
                placeholder="Ej: M"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                disabled={loading}
              />
            </div>
          </div>

          {/* Presets */}
          <div>
            <label className="text-sm font-medium mb-2 block">Tallas Predefinidas</label>
            <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
              {sizePresets.map((preset, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetClick(preset)}
                  disabled={loading}
                  className="text-xs"
                >
                  {preset.code}
                </Button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {(name || code) && (
            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
              <Ruler className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {name || 'Nueva Talla'} {code && `(${code})`}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
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
              disabled={loading || !name.trim() || !code.trim()}
              className="min-w-[100px]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Crear Talla
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default QuickSizeModal;
