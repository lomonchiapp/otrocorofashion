import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppInitializer from './components/AppInitializer';
import Layout from './components/Layout';
import ClientLayout from './components/ClientLayout';
import { ToastContainer } from './components/CustomToast';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import UserProfilePage from './pages/UserProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductsAdmin from './pages/admin/ProductsAdmin';
import CategoriesAdmin from './pages/admin/CategoriesAdmin';
import ColorsAdmin from './pages/admin/ColorsAdmin';
import ProductForm from './pages/admin/ProductForm';
import CategoryForm from './pages/admin/CategoryForm';
import ColorForm from './pages/admin/ColorForm';
import WishlistPage from './pages/WishlistPage';
import ClientDashboard from './pages/client/ClientDashboard';
import NotificationsAdmin from './pages/admin/NotificationsAdmin';
import AttributesAdmin from './pages/admin/AttributesAdmin';

function App() {
  return (
    <AppProvider>
      <AppInitializer />
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="product/:slug" element={<ProductDetailPage />} />
            <Route path="category/:categorySlug" element={<ProductsPage />} />
            <Route path="search" element={<ProductsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="client/*" element={<ClientLayout />}>
              <Route index element={<ClientDashboard />} />
              <Route path="profile" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Mi Perfil</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
              <Route path="orders" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Mis Pedidos</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
              <Route path="payment-methods" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Métodos de Pago</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
              <Route path="addresses" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Mis Direcciones</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
              <Route path="notifications" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Notificaciones</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
              <Route path="loyalty" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Programa de Fidelidad</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
              <Route path="settings" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Configuración</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
            </Route>
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="orders" element={<UserProfilePage />} />
            <Route path="sale" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Ofertas</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
            <Route path="about" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Sobre Nosotros</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
            <Route path="contact" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Contacto</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
            <Route path="shipping" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Información de Envío</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
            <Route path="returns" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Devoluciones</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
            <Route path="size-guide" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Guía de Tallas</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
            <Route path="faq" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Preguntas Frecuentes</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
            <Route path="support" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Soporte</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
            <Route path="blog" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Blog</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
            <Route path="privacy" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Política de Privacidad</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
            <Route path="terms" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Términos y Condiciones</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
            <Route path="cookies" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Política de Cookies</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
          </Route>
          
          {/* Admin Routes - Outside main layout */}
          <Route path="admin/*" element={<AdminDashboard />}>
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="categories" element={<CategoriesAdmin />} />
            <Route path="categories/new" element={<CategoryForm />} />
            <Route path="categories/edit/:id" element={<CategoryForm />} />
            <Route path="attributes" element={<AttributesAdmin />} />
            <Route path="colors" element={<ColorsAdmin />} />
            <Route path="colors/new" element={<ColorForm />} />
            <Route path="colors/edit/:id" element={<ColorForm />} />
            <Route path="images" element={<div className="animate-fade-in"><h1 className="text-2xl font-bold mb-4">Gestión de Imágenes</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
            <Route path="users" element={<div className="animate-fade-in"><h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
            <Route path="orders" element={<div className="animate-fade-in"><h1 className="text-2xl font-bold mb-4">Gestión de Pedidos</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
            <Route path="notifications" element={<NotificationsAdmin />} />
            <Route path="settings" element={<div className="animate-fade-in"><h1 className="text-2xl font-bold mb-4">Configuración</h1><p className="text-muted-foreground">Próximamente...</p></div>} />
          </Route>
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Recuperar Contraseña</h1><p className="text-muted-foreground">Próximamente...</p></div></div>} />
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Página no encontrada</h1><p className="text-muted-foreground">La página que buscas no existe.</p></div></div>} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
