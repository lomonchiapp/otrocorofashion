import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Palette } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { colorService } from '../services/firestoreService';
import { showToast } from './CustomToast';
import type { Color } from '../services/firestoreService';

interface QuickColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onColorCreated: (color: Color) => void;
}

const QuickColorModal: React.FC<QuickColorModalProps> = ({ isOpen, onClose, onColorCreated }) => {
  const [name, setName] = useState('');
  const [hexCode, setHexCode] = useState('#000000');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      showToast({
        title: 'Error',
        message: 'El nombre del color es requerido',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const colorData: any = {
        name: name.trim(),
        hexCode: hexCode,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const colorId = await colorService.create(colorData);
      const newColor = { id: colorId, ...colorData };
      
      onColorCreated(newColor);
      showToast({
        title: 'Color creado',
        message: `${name} ha sido creado exitosamente`,
        type: 'success'
      });
      
      // Reset form
      setName('');
      setHexCode('#000000');
      onClose();
    } catch (error) {
      console.error('Error creating color:', error);
      showToast({
        title: 'Error',
        message: 'Error al crear el color',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setHexCode('#000000');
    onClose();
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
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background border border-border rounded-lg shadow-2xl z-[9999] animate-in zoom-in-95 duration-200 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Palette className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Crear Color</h3>
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
          <div>
            <label className="text-sm font-medium mb-2 block">Nombre del Color *</label>
            <Input
              placeholder="Ej: Rojo Cereza"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Código de Color *</label>
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                value={hexCode}
                onChange={(e) => setHexCode(e.target.value)}
                disabled={loading}
                className="w-16 h-10 p-1 border-2"
              />
              <Input
                placeholder="#000000"
                value={hexCode}
                onChange={(e) => setHexCode(e.target.value)}
                disabled={loading}
                className="flex-1"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
            <div 
              className="w-6 h-6 rounded-full border-2 border-border"
              style={{ backgroundColor: hexCode }}
            />
            <span className="text-sm font-medium">{name || 'Nuevo Color'}</span>
          </div>

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
              disabled={loading || !name.trim()}
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
                  Crear Color
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

export default QuickColorModal;
