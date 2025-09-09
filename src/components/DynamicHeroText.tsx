import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowRight, Sparkles, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const DynamicHeroText: React.FC = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const textVariations = [
    {
      title: "MODA QUE",
      highlight: "INSPIRA",
      subtitle: "Descubre las últimas tendencias que marcan la diferencia",
      icon: <Sparkles className="w-6 h-6" />,
      gradient: "from-pink-500 via-purple-500 to-indigo-500"
    },
    {
      title: "ESTILO QUE",
      highlight: "ENAMORA",
      subtitle: "Cada prenda cuenta una historia única de elegancia",
      icon: <Heart className="w-6 h-6" />,
      gradient: "from-red-500 via-pink-500 to-rose-500"
    },
    {
      title: "CALIDAD QUE",
      highlight: "DESTACA",
      subtitle: "Materiales premium para looks extraordinarios",
      icon: <Star className="w-6 h-6" />,
      gradient: "from-amber-500 via-orange-500 to-red-500"
    },
    {
      title: "LOOKS QUE",
      highlight: "TRANSFORMAN",
      subtitle: "Reinventa tu estilo con piezas únicas y versátiles",
      icon: <Sparkles className="w-6 h-6" />,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % textVariations.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentText = textVariations[currentTextIndex];

  return (
    <div className="relative h-full flex flex-col justify-center px-8 lg:px-12">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-20 left-8 w-20 h-20 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-32 left-16 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-4 w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-md animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Contenido principal */}
      <div className="relative z-10 max-w-xl">
        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-sm rounded-full border border-white/20 mb-6 animate-fade-in">
          {currentText.icon}
          <span className="text-sm font-medium text-white/90">Nueva Colección 2024</span>
        </div>

        {/* Título principal con animación */}
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-4">
            <span className="text-white block">
              {currentText.title}
            </span>
            <span className={`bg-gradient-to-r ${currentText.gradient} bg-clip-text text-transparent block animate-glow`}>
              {currentText.highlight}
            </span>
          </h1>
        </div>

        {/* Subtítulo con animación */}
        <div className={`transition-all duration-300 delay-100 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
          <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-md">
            {currentText.subtitle}
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105 transition-all duration-300 border-0"
          >
            <Link to="/products" className="flex items-center">
              Explorar Ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold transition-all duration-300"
          >
            <Link to="/categories">
              Ver Categorías
            </Link>
          </Button>
        </div>

        {/* Indicadores de confianza */}
        <div className="flex items-center gap-6 text-sm text-white/70">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Envío Gratis +RD$8K</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <span>Pago Seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <span>30 días devolución</span>
          </div>
        </div>
      </div>

      {/* Líneas decorativas */}
      <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      <div className="absolute right-2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    </div>
  );
};

export default DynamicHeroText;
