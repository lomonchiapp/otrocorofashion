import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

/**
 * Componente que maneja la inicialización de la aplicación
 * Se ejecuta cuando la app se carga por primera vez
 */
const AppInitializer: React.FC = () => {
  const { dispatch } = useApp();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        // Aquí puedes agregar lógica de inicialización como:
        // - Cargar configuración de la app
        // - Verificar autenticación del usuario
        // - Cargar datos del carrito desde localStorage
        // - Configurar servicios externos
        
        // Ejemplo: Cargar carrito desde localStorage
        const savedCart = localStorage.getItem('otrocoro-cart');
        if (savedCart) {
          try {
            const cartData = JSON.parse(savedCart);
            // Aquí podrías restaurar el carrito si tuvieras una acción para ello
            console.log('Carrito guardado encontrado:', cartData);
          } catch (error) {
            console.error('Error al cargar carrito guardado:', error);
            localStorage.removeItem('otrocoro-cart');
          }
        }

        // Ejemplo: Verificar si hay usuario logueado
        const savedUser = localStorage.getItem('otrocoro-user');
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            dispatch({ type: 'SET_USER', payload: userData });
          } catch (error) {
            console.error('Error al cargar usuario guardado:', error);
            localStorage.removeItem('otrocoro-user');
          }
        }

        // Simular un pequeño delay para mostrar el estado de carga
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error('Error durante la inicialización:', error);
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'Error al inicializar la aplicación. Por favor, recarga la página.' 
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeApp();
  }, [dispatch]);

  // Este componente no renderiza nada visible
  return null;
};

export default AppInitializer;
