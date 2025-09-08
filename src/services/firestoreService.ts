import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { generateId } from '../lib/utils';

// Types for Firestore operations
export interface FirestoreProduct {
  id?: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  categoryId: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  variants: ProductVariant[];
  images: ProductImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  sku: string;
  colorId: string;
  sizeId: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  isActive: boolean;
  images: string[]; // Array of image URLs for this specific variant
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  colorId?: string; // If image is specific to a color
  isPrimary: boolean;
  order: number;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Color {
  id?: string;
  name: string;
  hexCode: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Size {
  id?: string;
  name: string;
  code: string;
  categoryId?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Generic Firestore service class
class FirestoreService<T> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  async create(data: Omit<T, 'id'>): Promise<string> {
    try {
      // Remove undefined values to avoid Firestore errors
      const cleanData = Object.fromEntries(
        Object.entries({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).filter(([_, value]) => value !== undefined)
      );

      const docRef = await addDoc(collection(db, this.collectionName), cleanData);
      return docRef.id;
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error);
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      // Remove undefined values to avoid Firestore errors
      const cleanData = Object.fromEntries(
        Object.entries({
          ...data,
          updatedAt: new Date(),
        }).filter(([_, value]) => value !== undefined)
      );

      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, cleanData);
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      throw error;
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting ${this.collectionName} by ID:`, error);
      throw error;
    }
  }

  async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const q = query(collection(db, this.collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as T));
    } catch (error) {
      console.error(`Error getting all ${this.collectionName}:`, error);
      throw error;
    }
  }

  async getPaginated(
    pageSize: number = 10,
    lastDoc?: DocumentSnapshot,
    constraints: QueryConstraint[] = []
  ): Promise<{ items: T[]; lastDoc: DocumentSnapshot | null }> {
    try {
      const baseConstraints = [...constraints, limit(pageSize)];
      if (lastDoc) {
        baseConstraints.push(startAfter(lastDoc));
      }

      const q = query(collection(db, this.collectionName), ...baseConstraints);
      const querySnapshot = await getDocs(q);
      
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as T));

      const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

      return { items, lastDoc: newLastDoc };
    } catch (error) {
      console.error(`Error getting paginated ${this.collectionName}:`, error);
      throw error;
    }
  }
}

// Specific services
export const productsService = new FirestoreService<FirestoreProduct>('products');
export const categoriesService = new FirestoreService<Category>('categories');
export const colorsService = new FirestoreService<Color>('colors');
export const sizesService = new FirestoreService<Size>('sizes');

// Product-specific methods
class ProductService extends FirestoreService<FirestoreProduct> {
  constructor() {
    super('products');
  }

  async getByCategory(categoryId: string): Promise<FirestoreProduct[]> {
    return this.getAll([
      where('categoryId', '==', categoryId),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    ]);
  }

  async getFeatured(limitCount: number = 10): Promise<FirestoreProduct[]> {
    return this.getAll([
      where('isFeatured', '==', true),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    ]);
  }

  async searchByName(searchTerm: string): Promise<FirestoreProduct[]> {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation. For better search, consider using Algolia or similar
    return this.getAll([
      where('isActive', '==', true),
      orderBy('name')
    ]).then(products => 
      products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  async updateStock(productId: string, variantId: string, newStock: number): Promise<void> {
    const product = await this.getById(productId);
    if (!product) throw new Error('Product not found');

    const updatedVariants = product.variants.map(variant =>
      variant.id === variantId ? { ...variant, stock: newStock } : variant
    );

    await this.update(productId, { variants: updatedVariants });
  }

  async toggleActive(productId: string): Promise<void> {
    const product = await this.getById(productId);
    if (!product) throw new Error('Product not found');

    await this.update(productId, { isActive: !product.isActive });
  }

  async toggleFeatured(productId: string): Promise<void> {
    const product = await this.getById(productId);
    if (!product) throw new Error('Product not found');

    await this.update(productId, { isFeatured: !product.isFeatured });
  }
}

export const productService = new ProductService();

// Category-specific methods
class CategoryService extends FirestoreService<Category> {
  constructor() {
    super('categories');
  }

  async getActive(): Promise<Category[]> {
    return this.getAll([
      where('isActive', '==', true),
      orderBy('order', 'asc')
    ]);
  }

  async getByParent(parentId: string): Promise<Category[]> {
    return this.getAll([
      where('parentId', '==', parentId),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    ]);
  }

  async getRootCategories(): Promise<Category[]> {
    return this.getAll([
      where('parentId', '==', null),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    ]);
  }
}

export const categoryService = new CategoryService();

// Color-specific methods
class ColorService extends FirestoreService<Color> {
  constructor() {
    super('colors');
  }

  async getActive(): Promise<Color[]> {
    return this.getAll([
      where('isActive', '==', true),
      orderBy('name', 'asc')
    ]);
  }
}

export const colorService = new ColorService();

// Size-specific methods
class SizeService extends FirestoreService<Size> {
  constructor() {
    super('sizes');
  }

  async getActive(): Promise<Size[]> {
    return this.getAll([
      where('isActive', '==', true),
      orderBy('order', 'asc')
    ]);
  }

  async getByCategory(categoryId: string): Promise<Size[]> {
    return this.getAll([
      where('categoryId', '==', categoryId),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    ]);
  }
}

export const sizeService = new SizeService();
