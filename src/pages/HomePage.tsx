import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw, Headphones, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import ProductCard from '../components/ProductCard';
import DynamicHeroText from '../components/DynamicHeroText';
import AdvancedCarousel from '../components/AdvancedCarousel';
import { getFeaturedProducts, mockCategories } from '../data/mockData';

const HomePage: React.FC = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="space-y-16">
      {/* Hero Section - Diseño avanzado estilo Shein con carousel 3D */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Fondo con patrones animados */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
          
          {/* Elementos flotantes decorativos */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse opacity-20"></div>
        </div>

        {/* Hero content layout */}
        <div className="relative z-10 h-screen flex flex-col">
          {/* Top section - Hero text */}
          <div className="flex-1 flex items-center justify-center px-4 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge superior */}
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-md rounded-full border border-white/30 mb-8 animate-fade-in-up">
                <Sparkles className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-white/90 font-medium">✨ Nueva Colección Primavera 2024</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>

              {/* Título principal */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 animate-slide-in-left">
                <span className="text-white block mb-2">MODA QUE</span>
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-glow">
                  ENAMORA
                </span>
              </h1>

              {/* Subtítulo */}
              <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto animate-slide-in-right">
                Descubre las últimas tendencias que marcan la diferencia en República Dominicana
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-pink-500/30 transform hover:scale-105 transition-all duration-300 border-0 animate-pulse-glow"
                >
                  <Link to="/products" className="flex items-center">
                    Explorar Colección
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/15 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white hover:text-black px-12 py-6 text-xl font-bold transition-all duration-300 hover:scale-105"
                >
                  Ver Ofertas 🔥
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-white/70 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">Envío Gratis +RD$8,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <span className="font-medium">Pago 100% Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <span className="font-medium">30 días devolución</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                  <span className="font-medium">+10K clientes felices</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section - Advanced Carousel superpuesto */}
          <div className="absolute bottom-0 left-0 right-0 h-[500px] z-20">
            <div className="relative h-full">
              {/* Gradient overlay para superponer el carousel */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-black/20 z-10"></div>
              
              {/* Advanced 3D Carousel */}
              <div className="h-full">
                <AdvancedCarousel />
              </div>
            </div>
          </div>

          {/* Indicador de scroll mejorado */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
            <div className="w-8 h-12 border-2 border-white/40 rounded-full flex justify-center backdrop-blur-md bg-white/10">
              <div className="w-1.5 h-4 bg-gradient-to-b from-pink-400 to-purple-500 rounded-full mt-2 animate-pulse shadow-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Categorías</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explora nuestra amplia gama de productos organizados por categorías
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockCategories.map((category) => (
            <Link key={category.id} to={`/category/${category.slug}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.description}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Productos Destacados</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubre nuestra selección especial de productos más populares
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <div key={product.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            <Link to="/products" className="flex items-center">
              Ver Todos los Productos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Envío Gratis</h3>
              <p className="text-muted-foreground text-sm">
                En compras superiores a RD$8,000
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Compra Segura</h3>
              <p className="text-muted-foreground text-sm">
                Protección total en tus pagos online
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Devoluciones</h3>
              <p className="text-muted-foreground text-sm">
                30 días para cambios y devoluciones
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Soporte 24/7</h3>
              <p className="text-muted-foreground text-sm">
                Atención personalizada cuando la necesites
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¡No te pierdas nada!
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Suscríbete a nuestro newsletter y recibe ofertas exclusivas, las últimas tendencias y novedades directamente en tu correo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-3 rounded-md text-black"
            />
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Suscribirse
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
