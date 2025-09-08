import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../lib/utils';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateCartQuantity, removeFromCart, clearCart } = useApp();
  const { cart } = state;

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 animate-fade-in">
        <div className="text-center max-w-md mx-auto animate-slide-up">
          <div className="relative mb-8">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4 animate-bounce-in" />
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl scale-150 animate-pulse"></div>
          </div>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Tu carrito está vacío
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            ¡Descubre nuestra increíble colección de moda!
          </p>
          <Button size="lg" onClick={() => navigate('/products')} className="hover-glow animate-scale-in">
            Explorar productos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 animate-slide-up">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center hover-lift smooth-transition"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continuar comprando
        </Button>
        <div className="border-l border-gray-300 pl-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Carrito de compras
          </h1>
          <p className="text-muted-foreground">
            <span className="animate-bounce-in inline-block">
              {cart.items.length} {cart.items.length === 1 ? 'producto' : 'productos'}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item, index) => (
            <Card key={item.id} className={`hover-lift smooth-transition animate-slide-up`} style={{animationDelay: `${index * 0.1}s`}}>
              <CardContent className="p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -skew-x-12 -translate-x-full animate-shimmer"></div>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="w-full sm:w-32 aspect-square">
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="font-semibold hover:text-primary transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          <span>
                            Color: {item.product.availableColors.find(c => c.id === item.variant.colorId)?.name}
                          </span>
                          {' • '}
                          <span>
                            Talla: {item.product.availableSizes.find(s => s.id === item.variant.sizeId)?.abbreviation}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          SKU: {item.variant.sku}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 smooth-transition hover:scale-110"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Quantity and Price Controls */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Cantidad:</span>
                        <div className="flex items-center border rounded-lg overflow-hidden hover-glow">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 smooth-transition hover:bg-primary/10"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 min-w-[2rem] text-center text-sm font-semibold bg-gradient-to-r from-primary/5 to-primary/10">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.variant.stock}
                            className="h-8 w-8 smooth-transition hover:bg-primary/10"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          (máx. {item.variant.stock})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatPrice(item.variant.price * item.quantity)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-sm text-muted-foreground">
                            {formatPrice(item.variant.price)} c/u
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Clear Cart */}
          <div className="text-center pt-4">
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-500 border-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Vaciar carrito
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Resumen del pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary Items */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span>
                    {cart.shipping === 0 ? (
                      <span className="text-green-600">Gratis</span>
                    ) : (
                      formatPrice(cart.shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ITBIS (18%):</span>
                  <span>{formatPrice(cart.tax)}</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>
              </div>

              {/* Shipping Info */}
              {cart.shipping === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <div className="flex items-center text-green-800 text-sm">
                    <span className="mr-2">🚚</span>
                    ¡Felicitaciones! Tu pedido califica para envío gratis
                  </div>
                </div>
              )}

              {cart.shipping > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 animate-pulse-slow">
                  <div className="text-blue-800 text-sm">
                    <span className="mr-2">💡</span>
                    Agrega {formatPrice(8000 - cart.subtotal)} más para envío gratis
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <Button className="w-full hover-glow animate-scale-in" size="lg">
                Proceder al pago
              </Button>

              {/* Continue Shopping */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/products')}
              >
                Continuar comprando
              </Button>

              {/* Security Info */}
              <div className="text-center text-xs text-muted-foreground mt-4">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span>🔒</span>
                  <span>Compra 100% segura</span>
                </div>
                <div>Aceptamos todas las tarjetas de crédito</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recently Viewed or Recommended Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">También te puede interesar</h2>
        <div className="text-center text-muted-foreground">
          <p>Aquí podrían ir productos recomendados basados en el carrito</p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
