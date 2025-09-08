import { useState, useEffect } from 'react';
import { productService } from '../services/firestoreService';

export const useFirestoreTest = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Firestore connection...');
        
        // Test basic connection
        await productService.getAll();
        
        // Test if we can create (this won't actually create, just test the method)
        console.log('ProductService methods available:', Object.getOwnPropertyNames(Object.getPrototypeOf(productService)));
        
        console.log('Firestore connection successful!');
        setIsConnected(true);
        setError(null);
      } catch (err) {
        console.error('Firestore connection failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return { isConnected, error, loading };
};
