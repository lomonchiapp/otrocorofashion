import { categoryService, colorService, sizeService } from '../services/firestoreService';

// Datos de ejemplo para poblar la base de datos
export const seedCategories = async () => {
  try {
    // Categorías principales
    const mujerCategoryId = await categoryService.create({
      name: 'Mujer',
      slug: 'mujer',
      description: 'Ropa y accesorios para mujer',
      isActive: true,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const hombreCategoryId = await categoryService.create({
      name: 'Hombre',
      slug: 'hombre',
      description: 'Ropa y accesorios para hombre',
      isActive: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const accesoriosCategoryId = await categoryService.create({
      name: 'Accesorios',
      slug: 'accesorios',
      description: 'Bolsos, joyas y otros accesorios',
      isActive: true,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Subcategorías de Mujer
    await categoryService.create({
      name: 'Vestidos',
      slug: 'vestidos',
      description: 'Vestidos para toda ocasión',
      parentId: mujerCategoryId,
      isActive: true,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await categoryService.create({
      name: 'Blusas',
      slug: 'blusas',
      description: 'Blusas y camisas para mujer',
      parentId: mujerCategoryId,
      isActive: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await categoryService.create({
      name: 'Pantalones',
      slug: 'pantalones-mujer',
      description: 'Pantalones y jeans para mujer',
      parentId: mujerCategoryId,
      isActive: true,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Subcategorías de Hombre
    await categoryService.create({
      name: 'Camisas',
      slug: 'camisas',
      description: 'Camisas formales e informales',
      parentId: hombreCategoryId,
      isActive: true,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await categoryService.create({
      name: 'Pantalones',
      slug: 'pantalones-hombre',
      description: 'Pantalones y jeans para hombre',
      parentId: hombreCategoryId,
      isActive: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Categorías creadas exitosamente');
  } catch (error) {
    console.error('Error creando categorías:', error);
  }
};

export const seedColors = async () => {
  try {
    const colors = [
      { name: 'Negro', hexCode: '#000000' },
      { name: 'Blanco', hexCode: '#FFFFFF' },
      { name: 'Rojo', hexCode: '#DC2626' },
      { name: 'Azul', hexCode: '#2563EB' },
      { name: 'Verde', hexCode: '#16A34A' },
      { name: 'Rosa', hexCode: '#EC4899' },
      { name: 'Amarillo', hexCode: '#EAB308' },
      { name: 'Gris', hexCode: '#6B7280' },
      { name: 'Beige', hexCode: '#D2B48C' },
      { name: 'Morado', hexCode: '#9333EA' }
    ];

    for (const color of colors) {
      await colorService.create({
        ...color,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log('Colores creados exitosamente');
  } catch (error) {
    console.error('Error creando colores:', error);
  }
};

export const seedSizes = async () => {
  try {
    // Tallas de ropa
    const clothingSizes = [
      { name: 'Extra Pequeño', code: 'XS', order: 0 },
      { name: 'Pequeño', code: 'S', order: 1 },
      { name: 'Mediano', code: 'M', order: 2 },
      { name: 'Grande', code: 'L', order: 3 },
      { name: 'Extra Grande', code: 'XL', order: 4 },
      { name: 'Extra Extra Grande', code: 'XXL', order: 5 }
    ];

    // Tallas de zapatos
    const shoeSizes = [
      { name: 'Talla 36', code: '36', order: 0 },
      { name: 'Talla 37', code: '37', order: 1 },
      { name: 'Talla 38', code: '38', order: 2 },
      { name: 'Talla 39', code: '39', order: 3 },
      { name: 'Talla 40', code: '40', order: 4 },
      { name: 'Talla 41', code: '41', order: 5 },
      { name: 'Talla 42', code: '42', order: 6 },
      { name: 'Talla 43', code: '43', order: 7 },
      { name: 'Talla 44', code: '44', order: 8 }
    ];

    const allSizes = [...clothingSizes, ...shoeSizes];

    for (const size of allSizes) {
      await sizeService.create({
        ...size,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log('Tallas creadas exitosamente');
  } catch (error) {
    console.error('Error creando tallas:', error);
  }
};

// Función para poblar todos los datos de ejemplo
export const seedAllData = async () => {
  console.log('Iniciando población de datos...');
  await seedCategories();
  await seedColors();
  await seedSizes();
  console.log('Datos de ejemplo creados exitosamente');
};










