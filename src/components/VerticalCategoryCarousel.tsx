import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  image: string;
  itemCount: number;
  link: string;
}

const VerticalCategoryCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const categories: CategoryItem[] = [
    {
      id: '1',
      name: 'T-Shirts',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
      itemCount: 240,
      link: '/category/tshirts'
    },
    {
      id: '2',
      name: 'Jeans',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
      itemCount: 180,
      link: '/category/jeans'
    },
    {
      id: '3',
      name: 'Gorras',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=500&fit=crop',
      itemCount: 95,
      link: '/category/gorras'
    },
    {
      id: '4',
      name: 'Sneakers',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
      itemCount: 320,
      link: '/category/sneakers'
    },
    {
      id: '5',
      name: 'Vestidos',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop',
      itemCount: 150,
      link: '/category/vestidos'
    },
    {
      id: '6',
      name: 'Chaquetas',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
      itemCount: 120,
      link: '/category/chaquetas'
    }
  ];

  // Duplicamos las categorías para el loop infinito
  const duplicatedCategories = [...categories, ...categories, ...categories];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    const scrollSpeed = 0.5; // Velocidad de scroll (píxeles por frame)

    const animate = () => {
      if (scrollContainer) {
        scrollContainer.scrollTop += scrollSpeed;
        
        // Reset cuando llegamos al final del primer set de categorías
        const maxScroll = scrollContainer.scrollHeight / 3;
        if (scrollContainer.scrollTop >= maxScroll) {
          scrollContainer.scrollTop = 0;
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // Pausar animación al hacer hover
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationId);
    };

    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="relative h-full flex items-center justify-center px-8">
      {/* Gradientes para efecto fade */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
      
      {/* Contenedor del carousel */}
      <div 
        ref={scrollRef}
        className="h-[600px] w-full max-w-sm overflow-hidden scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="space-y-6 py-10">
          {duplicatedCategories.map((category, index) => (
            <Link
              key={`${category.id}-${index}`}
              to={category.link}
              className="group block"
            >
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 shadow-2xl hover:shadow-white/10 transition-all duration-500 hover:scale-105 hover:bg-white/15">
                {/* Imagen de fondo */}
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Icono de enlace */}
                  <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                {/* Contenido */}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-pink-300 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {category.itemCount}+ productos
                  </p>
                  
                  {/* Barra de progreso decorativa */}
                  <div className="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-700 group-hover:w-full"
                      style={{ width: '30%' }}
                    />
                  </div>
                </div>
                
                {/* Efecto de brillo al hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Texto decorativo lateral */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 rotate-90 text-white/30 text-sm font-medium tracking-widest">
        CATEGORÍAS
      </div>
    </div>
  );
};

export default VerticalCategoryCarousel;
