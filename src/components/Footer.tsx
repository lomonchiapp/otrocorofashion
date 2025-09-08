import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Footer: React.FC = () => {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    alert('¡Gracias por suscribirte a nuestro newsletter!');
  };

  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-secondary-foreground/10">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Mantente al día con Otro Coro Fashion
            </h3>
            <p className="text-secondary-foreground/80 mb-6">
              Suscríbete a nuestro newsletter y recibe las últimas tendencias, ofertas exclusivas y novedades directamente en tu correo.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                className="bg-background text-foreground"
                required
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Suscribirse
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">O</span>
              </div>
              <span className="font-bold text-xl text-primary">
                Otro Coro Fashion
              </span>
            </div>
            <p className="text-secondary-foreground/80 text-sm">
              Tu destino para la moda más elegante y moderna. Descubre las últimas tendencias con la calidad que mereces.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-secondary-foreground/80 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-secondary-foreground/80 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-secondary-foreground/80 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/sale" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Atención al Cliente</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shipping" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Información de Envío
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Guía de Tallas
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  Soporte
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contacto</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-secondary-foreground/80">
                  Calle 123 #45-67<br />
                  Santo Domingo, República Dominicana
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-secondary-foreground/80">
                  +1 (809) 234-5678
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-secondary-foreground/80">
                  info@otrocorofashion.com
                </span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-secondary-foreground/60">
                Horario de atención:<br />
                Lun - Vie: 9:00 AM - 6:00 PM<br />
                Sáb: 10:00 AM - 4:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-secondary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-secondary-foreground/60">
              © 2024 Otro Coro Fashion. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                Política de Privacidad
              </Link>
              <Link to="/terms" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                Términos y Condiciones
              </Link>
              <Link to="/cookies" className="text-secondary-foreground/60 hover:text-primary transition-colors">
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
