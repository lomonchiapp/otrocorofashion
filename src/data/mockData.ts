import type { Category, Color, Size, Product, ProductImage, ProductVariant, User, Address } from "../types";
import { generateId } from "../lib/utils";

// Colores disponibles
export const mockColors: Color[] = [
  { id: "1", name: "Negro", hex: "#000000", isActive: true },
  { id: "2", name: "Blanco", hex: "#FFFFFF", isActive: true },
  { id: "3", name: "Rojo", hex: "#DC2626", isActive: true },
  { id: "4", name: "Azul Marino", hex: "#1E3A8A", isActive: true },
  { id: "5", name: "Gris", hex: "#6B7280", isActive: true },
  { id: "6", name: "Beige", hex: "#F5F5DC", isActive: true },
  { id: "7", name: "Rosa", hex: "#EC4899", isActive: true },
  { id: "8", name: "Verde", hex: "#059669", isActive: true },
];

// Tallas disponibles
export const mockSizes: Size[] = [
  { id: "1", name: "Extra Pequeño", abbreviation: "XS", sortOrder: 1, isActive: true },
  { id: "2", name: "Pequeño", abbreviation: "S", sortOrder: 2, isActive: true },
  { id: "3", name: "Mediano", abbreviation: "M", sortOrder: 3, isActive: true },
  { id: "4", name: "Grande", abbreviation: "L", sortOrder: 4, isActive: true },
  { id: "5", name: "Extra Grande", abbreviation: "XL", sortOrder: 5, isActive: true },
  { id: "6", name: "Extra Extra Grande", abbreviation: "XXL", sortOrder: 6, isActive: true },
];

// Categorías
export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Mujer",
    slug: "mujer",
    description: "Moda femenina elegante y moderna",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    subcategories: [
      {
        id: "1-1",
        name: "Vestidos",
        slug: "vestidos",
        description: "Vestidos elegantes para toda ocasión",
        parentId: "1",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "1-2",
        name: "Blusas",
        slug: "blusas",
        description: "Blusas y camisas femeninas",
        parentId: "1",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "1-3",
        name: "Pantalones",
        slug: "pantalones-mujer",
        description: "Pantalones y jeans para mujer",
        parentId: "1",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: "2",
    name: "Hombre",
    slug: "hombre",
    description: "Moda masculina moderna y sofisticada",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    subcategories: [
      {
        id: "2-1",
        name: "Camisas",
        slug: "camisas",
        description: "Camisas formales y casuales",
        parentId: "2",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2-2",
        name: "Pantalones",
        slug: "pantalones-hombre",
        description: "Pantalones y jeans para hombre",
        parentId: "2",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2-3",
        name: "Chaquetas",
        slug: "chaquetas",
        description: "Chaquetas y blazers masculinos",
        parentId: "2",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: "3",
    name: "Accesorios",
    slug: "accesorios",
    description: "Complementos perfectos para tu outfit",
    image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=500",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Productos
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Vestido Rojo Elegante",
    slug: "vestido-rojo-elegante",
    description: "Hermoso vestido rojo perfecto para ocasiones especiales. Confeccionado en tela de alta calidad con un corte que realza la figura femenina. Ideal para eventos formales, cenas románticas o celebraciones importantes.",
    shortDescription: "Vestido rojo elegante para ocasiones especiales",
    categoryId: "1-1",
    basePrice: 7500,
    compareAtPrice: 9800,
    images: [
      {
        id: "1-1",
        url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800",
        alt: "Vestido rojo elegante - vista frontal",
        isPrimary: true,
        sortOrder: 1,
      },
      {
        id: "1-2",
        url: "https://images.unsplash.com/photo-1566479179817-c0b0d0b7a67e?w=800",
        alt: "Vestido rojo elegante - vista lateral",
        isPrimary: false,
        sortOrder: 2,
      },
    ],
    variants: [
      {
        id: "1-3-2",
        productId: "1",
        colorId: "3",
        sizeId: "2",
        sku: "VRE-R-S",
        price: 7500,
        compareAtPrice: 9800,
        stock: 5,
        isActive: true,
      },
      {
        id: "1-3-3",
        productId: "1",
        colorId: "3",
        sizeId: "3",
        sku: "VRE-R-M",
        price: 7500,
        compareAtPrice: 9800,
        stock: 3,
        isActive: true,
      },
      {
        id: "1-3-4",
        productId: "1",
        colorId: "3",
        sizeId: "4",
        sku: "VRE-R-L",
        price: 7500,
        compareAtPrice: 9800,
        stock: 2,
        isActive: true,
      },
    ],
    availableColors: [mockColors[2]], // Rojo
    availableSizes: [mockSizes[1], mockSizes[2], mockSizes[3]], // S, M, L
    tags: ["vestido", "elegante", "formal", "rojo"],
    isFeatured: true,
    isActive: true,
    stockTotal: 10,
    rating: 4.8,
    reviewCount: 24,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Camisa Blanca Clásica",
    slug: "camisa-blanca-clasica",
    description: "Camisa blanca clásica de corte perfecto. Ideal para el trabajo o eventos formales. Confeccionada en algodón de primera calidad con acabados impecables.",
    shortDescription: "Camisa blanca clásica de corte perfecto",
    categoryId: "2-1",
    basePrice: 4200,
    images: [
      {
        id: "2-1",
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
        alt: "Camisa blanca clásica - vista frontal",
        isPrimary: true,
        sortOrder: 1,
      },
    ],
    variants: [
      {
        id: "2-2-3",
        productId: "2",
        colorId: "2",
        sizeId: "3",
        sku: "CBC-B-M",
        price: 4200,
        stock: 8,
        isActive: true,
      },
      {
        id: "2-2-4",
        productId: "2",
        colorId: "2",
        sizeId: "4",
        sku: "CBC-B-L",
        price: 4200,
        stock: 6,
        isActive: true,
      },
    ],
    availableColors: [mockColors[1]], // Blanco
    availableSizes: [mockSizes[2], mockSizes[3]], // M, L
    tags: ["camisa", "blanca", "formal", "clásica"],
    isFeatured: false,
    isActive: true,
    stockTotal: 14,
    rating: 4.5,
    reviewCount: 18,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Jeans Negro Skinny",
    slug: "jeans-negro-skinny",
    description: "Jeans negro de corte skinny que se adapta perfectamente a tu figura. Confeccionado en denim de alta calidad con un toque de elastano para mayor comodidad.",
    shortDescription: "Jeans negro skinny de alta calidad",
    categoryId: "1-3",
    basePrice: 4800,
    compareAtPrice: 5900,
    images: [
      {
        id: "3-1",
        url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
        alt: "Jeans negro skinny - vista frontal",
        isPrimary: true,
        sortOrder: 1,
      },
    ],
    variants: [
      {
        id: "3-1-2",
        productId: "3",
        colorId: "1",
        sizeId: "2",
        sku: "JNS-N-S",
        price: 4800,
        compareAtPrice: 5900,
        stock: 4,
        isActive: true,
      },
      {
        id: "3-1-3",
        productId: "3",
        colorId: "1",
        sizeId: "3",
        sku: "JNS-N-M",
        price: 4800,
        compareAtPrice: 5900,
        stock: 7,
        isActive: true,
      },
      {
        id: "3-1-4",
        productId: "3",
        colorId: "1",
        sizeId: "4",
        sku: "JNS-N-L",
        price: 4800,
        compareAtPrice: 5900,
        stock: 5,
        isActive: true,
      },
    ],
    availableColors: [mockColors[0]], // Negro
    availableSizes: [mockSizes[1], mockSizes[2], mockSizes[3]], // S, M, L
    tags: ["jeans", "negro", "skinny", "denim"],
    isFeatured: true,
    isActive: true,
    stockTotal: 16,
    rating: 4.6,
    reviewCount: 32,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Blusa Rosa Romántica",
    slug: "blusa-rosa-romantica",
    description: "Blusa rosa con detalles románticos. Perfecta para looks casuales y elegantes. Confeccionada en tela suave y cómoda.",
    shortDescription: "Blusa rosa con detalles románticos",
    categoryId: "1-2",
    basePrice: 3200,
    images: [
      {
        id: "4-1",
        url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800",
        alt: "Blusa rosa romántica - vista frontal",
        isPrimary: true,
        sortOrder: 1,
      },
    ],
    variants: [
      {
        id: "4-7-2",
        productId: "4",
        colorId: "7",
        sizeId: "2",
        sku: "BRR-R-S",
        price: 3200,
        stock: 6,
        isActive: true,
      },
      {
        id: "4-7-3",
        productId: "4",
        colorId: "7",
        sizeId: "3",
        sku: "BRR-R-M",
        price: 3200,
        stock: 8,
        isActive: true,
      },
    ],
    availableColors: [mockColors[6]], // Rosa
    availableSizes: [mockSizes[1], mockSizes[2]], // S, M
    tags: ["blusa", "rosa", "romántica", "casual"],
    isFeatured: false,
    isActive: true,
    stockTotal: 14,
    rating: 4.3,
    reviewCount: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "Chaqueta Negra Ejecutiva",
    slug: "chaqueta-negra-ejecutiva",
    description: "Chaqueta negra de corte ejecutivo. Perfecta para el ambiente laboral y eventos formales. Confeccionada con materiales de primera calidad.",
    shortDescription: "Chaqueta negra de corte ejecutivo",
    categoryId: "2-3",
    basePrice: 8900,
    images: [
      {
        id: "5-1",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        alt: "Chaqueta negra ejecutiva - vista frontal",
        isPrimary: true,
        sortOrder: 1,
      },
    ],
    variants: [
      {
        id: "5-1-3",
        productId: "5",
        colorId: "1",
        sizeId: "3",
        sku: "CNE-N-M",
        price: 8900,
        stock: 3,
        isActive: true,
      },
      {
        id: "5-1-4",
        productId: "5",
        colorId: "1",
        sizeId: "4",
        sku: "CNE-N-L",
        price: 8900,
        stock: 4,
        isActive: true,
      },
    ],
    availableColors: [mockColors[0]], // Negro
    availableSizes: [mockSizes[2], mockSizes[3]], // M, L
    tags: ["chaqueta", "negra", "ejecutiva", "formal"],
    isFeatured: true,
    isActive: true,
    stockTotal: 7,
    rating: 4.7,
    reviewCount: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    name: "Pantalón Beige Casual",
    slug: "pantalon-beige-casual",
    description: "Pantalón beige de corte casual. Cómodo y versátil para el día a día. Perfecto para combinar con diferentes estilos.",
    shortDescription: "Pantalón beige de corte casual",
    categoryId: "2-2",
    basePrice: 4500,
    images: [
      {
        id: "6-1",
        url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
        alt: "Pantalón beige casual - vista frontal",
        isPrimary: true,
        sortOrder: 1,
      },
    ],
    variants: [
      {
        id: "6-6-3",
        productId: "6",
        colorId: "6",
        sizeId: "3",
        sku: "PBC-B-M",
        price: 4500,
        stock: 5,
        isActive: true,
      },
      {
        id: "6-6-4",
        productId: "6",
        colorId: "6",
        sizeId: "4",
        sku: "PBC-B-L",
        price: 4500,
        stock: 7,
        isActive: true,
      },
    ],
    availableColors: [mockColors[5]], // Beige
    availableSizes: [mockSizes[2], mockSizes[3]], // M, L
    tags: ["pantalón", "beige", "casual", "cómodo"],
    isFeatured: false,
    isActive: true,
    stockTotal: 12,
    rating: 4.4,
    reviewCount: 21,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Usuarios mock
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@otrocorofashion.com",
    firstName: "Admin",
    lastName: "Sistema",
    phone: "+18091234567",
    isActive: true,
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    email: "maria.garcia@gmail.com",
    firstName: "María",
    lastName: "García",
    phone: "+573009876543",
    dateOfBirth: new Date("1990-05-15"),
    gender: "female",
    isActive: true,
    role: "customer",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    email: "carlos.rodriguez@gmail.com",
    firstName: "Carlos",
    lastName: "Rodríguez",
    phone: "+573005551234",
    dateOfBirth: new Date("1985-08-22"),
    gender: "male",
    isActive: true,
    role: "customer",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Direcciones mock
export const mockAddresses: Address[] = [
  {
    id: "1",
    userId: "2",
    type: "shipping",
    firstName: "María",
    lastName: "García",
    address1: "Calle 123 #45-67",
    city: "Santo Domingo",
    state: "Distrito Nacional",
    postalCode: "10101",
    country: "República Dominicana",
    phone: "+573009876543",
    isDefault: true,
  },
  {
    id: "2",
    userId: "3",
    type: "shipping",
    firstName: "Carlos",
    lastName: "Rodríguez",
    address1: "Carrera 45 #67-89",
    address2: "Apto 301",
    city: "Santiago",
    state: "Santiago",
    postalCode: "51000",
    country: "República Dominicana",
    phone: "+573005551234",
    isDefault: true,
  },
];

// Función para obtener productos destacados
export const getFeaturedProducts = (): Product[] => {
  return mockProducts.filter(product => product.isFeatured);
};

// Función para obtener productos por categoría
export const getProductsByCategory = (categoryId: string): Product[] => {
  return mockProducts.filter(product => 
    product.categoryId === categoryId || 
    product.categoryId.startsWith(categoryId + "-")
  );
};

// Función para buscar productos
export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
