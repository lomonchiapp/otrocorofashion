import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface CarouselItem {
  id: string;
  name: string;
  image: string;
  itemCount: number;
  link: string;
  color: string;
  gradient: string;
}

const AdvancedCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const categories: CarouselItem[] = [
    {
      id: '1',
      name: 'T-Shirts Premium',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop&auto=format',
      itemCount: 240,
      link: '/category/tshirts',
      color: '#FF6B6B',
      gradient: 'from-red-400 to-pink-500'
    },
    {
      id: '2',
      name: 'Jeans Exclusivos',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=600&fit=crop&auto=format',
      itemCount: 180,
      link: '/category/jeans',
      color: '#4ECDC4',
      gradient: 'from-teal-400 to-blue-500'
    },
    {
      id: '3',
      name: 'Gorras Urbanas',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=600&fit=crop&auto=format',
      itemCount: 95,
      link: '/category/gorras',
      color: '#45B7D1',
      gradient: 'from-blue-400 to-indigo-500'
    },
    {
      id: '4',
      name: 'Sneakers Elite',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop&auto=format',
      itemCount: 320,
      link: '/category/sneakers',
      color: '#96CEB4',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      id: '5',
      name: 'Vestidos Únicos',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=600&fit=crop&auto=format',
      itemCount: 150,
      link: '/category/vestidos',
      color: '#FFEAA7',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      id: '6',
      name: 'Chaquetas de Moda',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop&auto=format',
      itemCount: 120,
      link: '/category/chaquetas',
      color: '#DDA0DD',
      gradient: 'from-purple-400 to-pink-500'
    }
  ];

  // Auto-play effect
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % categories.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, categories.length]);

  // Calculate item positions and scales
  const getItemStyle = (index: number) => {
    const totalItems = categories.length;
    const centerIndex = currentIndex;
    
    // Calculate distance from center
    let distance = Math.abs(index - centerIndex);
    if (distance > totalItems / 2) {
      distance = totalItems - distance;
    }
    
    // Calculate scale based on distance (center item is biggest)
    const maxScale = 1.2;
    const minScale = 0.7;
    const scale = distance === 0 ? maxScale : 
                  distance === 1 ? 0.95 : 
                  distance === 2 ? 0.8 : minScale;
    
    // Calculate rotation for 3D effect
    const rotation = distance === 0 ? 0 : 
                    (index - centerIndex) * 8 * (distance > 2 ? 0.5 : 1);
    
    // Calculate z-index
    const zIndex = totalItems - distance;
    
    // Calculate opacity
    const opacity = distance === 0 ? 1 : 
                   distance === 1 ? 0.9 : 
                   distance === 2 ? 0.7 : 0.5;
    
    // Calculate vertical position for semi-circular effect
    const yOffset = distance * 20;
    
    // Calculate horizontal position
    const baseX = (index - centerIndex) * 120;
    const xOffset = Math.sin((distance / totalItems) * Math.PI) * 50;
    
    return {
      transform: `
        translateX(${baseX + xOffset}px) 
        translateY(${yOffset}px) 
        scale(${scale}) 
        rotateY(${rotation}deg)
        rotateX(${distance * 5}deg)
      `,
      zIndex,
      opacity,
      filter: distance === 0 ? 'brightness(1.1) saturate(1.2)' : 
              distance === 1 ? 'brightness(1.05) saturate(1.1)' : 
              'brightness(0.9) saturate(0.8)'
    };
  };

  const handleItemClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    
    // Resume autoplay after 5 seconds
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const currentCategory = categories[currentIndex];

  return (
    <div className="relative h-full w-full overflow-hidden perspective-1000">
      {/* Background gradient that changes with current item */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${currentCategory.gradient} opacity-20 transition-all duration-1000`}
      />
      
      {/* Floating background elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 3)}s`
            }}
          >
            <Sparkles 
              className="w-4 h-4 text-white/10" 
              style={{ 
                filter: `hue-rotate(${i * 60}deg)`,
              }} 
            />
          </div>
        ))}
      </div>

      {/* Main carousel container */}
      <div 
        ref={containerRef}
        className="relative h-full flex items-center justify-center"
        style={{ perspective: '1000px' }}
      >
        <div className="relative w-full h-[500px] flex items-center justify-center">
          {categories.map((category, index) => {
            const style = getItemStyle(index);
            const isCurrent = index === currentIndex;
            
            return (
              <div
                key={category.id}
                className={`absolute transition-all duration-700 ease-out cursor-pointer ${
                  isCurrent ? 'hover:scale-110' : 'hover:scale-105'
                }`}
                style={style}
                onClick={() => handleItemClick(index)}
              >
                <div className={`
                  relative w-64 h-80 rounded-3xl overflow-hidden shadow-2xl
                  ${isCurrent ? 'ring-4 ring-white/50' : ''}
                  bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm
                  border border-white/20
                  hover:ring-2 hover:ring-white/30
                  transform-gpu
                `}>
                  {/* Category image */}
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-1000"
                      style={{
                        transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                      }}
                    />
                    
                    {/* Overlay gradient */}
                    <div className={`
                      absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent
                      ${isCurrent ? 'from-black/50' : 'from-black/80'}
                      transition-all duration-700
                    `} />
                    
                    {/* Shine effect */}
                    {isCurrent && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shine" />
                    )}
                    
                    {/* Link icon */}
                    <Link to={category.link}>
                      <div className={`
                        absolute top-4 right-4 w-10 h-10 
                        bg-white/20 backdrop-blur-sm rounded-full 
                        flex items-center justify-center
                        transition-all duration-300
                        ${isCurrent ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
                        hover:bg-white/30 hover:scale-110
                      `}>
                        <ArrowUpRight className="w-5 h-5 text-white" />
                      </div>
                    </Link>
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className={`
                      font-bold text-white mb-2 transition-all duration-300
                      ${isCurrent ? 'text-2xl' : 'text-lg'}
                    `}>
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-sm mb-3">
                      {category.itemCount}+ productos disponibles
                    </p>
                    
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className={`
                          h-full rounded-full transition-all duration-1000
                          bg-gradient-to-r ${category.gradient}
                          ${isCurrent ? 'w-full' : 'w-1/3'}
                        `}
                      />
                    </div>
                  </div>
                  
                  {/* Current item glow */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-3xl ring-2 ring-white/30 animate-pulse" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {categories.map((_, index) => (
          <button
            key={index}
            onClick={() => handleItemClick(index)}
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${index === currentIndex 
                ? 'bg-white scale-125 shadow-lg' 
                : 'bg-white/40 hover:bg-white/60'
              }
            `}
          />
        ))}
      </div>

      {/* Current category info overlay */}
      <div className="absolute top-8 left-8 text-white">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 max-w-sm">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: currentCategory.color }}
            />
            <span className="text-sm font-medium opacity-80">Categoría Destacada</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">{currentCategory.name}</h2>
          <p className="text-white/80 text-sm">
            Descubre nuestra colección exclusiva con {currentCategory.itemCount}+ productos únicos
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCarousel;
