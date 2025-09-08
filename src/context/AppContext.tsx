import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { User, Cart, Wishlist, CartItem, Product, ProductVariant } from '../types';
import { generateId } from '../lib/utils';

interface AppState {
  user: User | null;
  cart: Cart;
  wishlist: Wishlist[];
  isLoading: boolean;
  error: string | null;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TO_CART'; payload: { product: Product; variant: ProductVariant; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: { product: Product } }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string };

const initialState: AppState = {
  user: null,
  cart: {
    id: generateId(),
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  wishlist: [],
  isLoading: false,
  error: null,
};

const calculateCartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);
  const tax = subtotal * 0.18; // ITBIS República Dominicana 18%
  const shipping = subtotal > 8000 ? 0 : 500; // Envío gratis por compras mayores a RD$8,000
  const total = subtotal + tax + shipping;
  
  return { subtotal, tax, shipping, total };
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'ADD_TO_CART': {
      const { product, variant, quantity } = action.payload;
      const existingItemIndex = state.cart.items.findIndex(
        item => item.variantId === variant.id
      );
      
      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Si el item ya existe, actualizar cantidad
        newItems = state.cart.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si es un nuevo item, agregarlo
        const newItem: CartItem = {
          id: generateId(),
          productId: product.id,
          variantId: variant.id,
          product,
          variant,
          quantity,
          addedAt: new Date(),
        };
        newItems = [...state.cart.items, newItem];
      }
      
      const totals = calculateCartTotals(newItems);
      
      return {
        ...state,
        cart: {
          ...state.cart,
          items: newItems,
          ...totals,
          updatedAt: new Date(),
        },
      };
    }
    
    case 'REMOVE_FROM_CART': {
      const newItems = state.cart.items.filter(item => item.id !== action.payload);
      const totals = calculateCartTotals(newItems);
      
      return {
        ...state,
        cart: {
          ...state.cart,
          items: newItems,
          ...totals,
          updatedAt: new Date(),
        },
      };
    }
    
    case 'UPDATE_CART_QUANTITY': {
      const { itemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Si la cantidad es 0 o menor, remover el item
        const newItems = state.cart.items.filter(item => item.id !== itemId);
        const totals = calculateCartTotals(newItems);
        
        return {
          ...state,
          cart: {
            ...state.cart,
            items: newItems,
            ...totals,
            updatedAt: new Date(),
          },
        };
      }
      
      const newItems = state.cart.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      const totals = calculateCartTotals(newItems);
      
      return {
        ...state,
        cart: {
          ...state.cart,
          items: newItems,
          ...totals,
          updatedAt: new Date(),
        },
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [],
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0,
          updatedAt: new Date(),
        },
      };
    
    case 'ADD_TO_WISHLIST': {
      const { product } = action.payload;
      const exists = state.wishlist.find(item => item.productId === product.id);
      
      if (exists) return state;
      
      const newWishlistItem: Wishlist = {
        id: generateId(),
        userId: state.user?.id || '',
        productId: product.id,
        product,
        createdAt: new Date(),
      };
      
      return {
        ...state,
        wishlist: [...state.wishlist, newWishlistItem],
      };
    }
    
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.productId !== action.payload),
      };
    
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  addToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getCartItemsCount: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, variant, quantity } });
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const addToWishlist = (product: Product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: { product } });
  };

  const removeFromWishlist = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  const isInWishlist = (productId: string): boolean => {
    return state.wishlist.some(item => item.productId === productId);
  };

  const getCartItemsCount = (): number => {
    return state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value: AppContextType = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getCartItemsCount,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
