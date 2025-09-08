import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import ProductCard from '../components/ProductCard';
import { getFeaturedProducts, mockCategories } from '../data/mockData';

const HomePage: React.FC = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden animate-fade-in">
        {/* Background Image with Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110 animate-slow-zoom"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80)'
          }}
        ></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Animated Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-20 w-1 h-1 bg-primary/60 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
        
        {/* Main Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <div className="animate-slide-up">
            {/* Brand Logo/Name */}
            <div className="mb-8">
              <img 
                src="/logo-white.png" 
                alt="Otro Coro Fashion" 
                className="h-16 md:h-20 mx-auto mb-4 hover-lift animate-bounce-in"
              />
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto animate-scale-in" style={{ animationDelay: '0.5s' }}></div>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                MODA
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-red-500 to-primary bg-clip-text text-transparent animate-glow">
                DOMINICANA
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl lg:text-3xl mb-8 font-light text-gray-200 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Descubre las últimas tendencias con 
              <span className="text-primary font-semibold"> estilo único </span>
              y calidad excepcional
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold hover-glow shadow-2xl transform hover:scale-105 transition-all duration-300">
                <Link to="/products" className="flex items-center">
                  Explorar Colección
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold hover-lift transition-all duration-300">
                <Link to="/sale" className="flex items-center">
                  Ver Ofertas
                  <span className="ml-3 text-primary">🔥</span>
                </Link>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-300 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Envío Gratis RD$8,000+</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-500"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span>Pago 100% Seguro</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-500"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span>Devoluciones 30 Días</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
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
