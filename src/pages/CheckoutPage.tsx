import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  CheckCircle, 
  ArrowLeft,
  Package,
  Truck,
  Shield
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';

interface CheckoutStep {
  id: number;
  title: string;
  completed: boolean;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  method: 'card' | 'paypal' | 'bank';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

const CheckoutPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [orderProcessed, setOrderProcessed] = useState(false);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Santo Domingo',
    zipCode: '',
    country: 'República Dominicana'
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const steps: CheckoutStep[] = [
    { id: 1, title: 'Información de Envío', completed: currentStep > 1 },
    { id: 2, title: 'Método de Pago', completed: currentStep > 2 },
    { id: 3, title: 'Revisión y Confirmación', completed: orderProcessed }
  ];

  // Calcular totales
  const subtotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 8000 ? 0 : 500; // Envío gratis por encima de RD$8,000
  const tax = subtotal * 0.18; // ITBIS 18%
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isShippingValid()) {
      setCurrentStep(2);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPaymentValid()) {
      setCurrentStep(3);
    }
  };

  const handleOrderConfirm = async () => {
    setIsLoading(true);
    
    // Simular procesamiento del pedido
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Limpiar carrito
    dispatch({ type: 'CLEAR_CART' });
    
    setOrderProcessed(true);
    setIsLoading(false);
    
    // Redirigir después de 3 segundos
    setTimeout(() => {
      navigate('/orders');
    }, 3000);
  };

  const isShippingValid = () => {
    return shippingInfo.firstName && 
           shippingInfo.lastName && 
           shippingInfo.email && 
           shippingInfo.phone && 
           shippingInfo.address && 
           shippingInfo.city;
  };

  const isPaymentValid = () => {
    if (paymentInfo.method === 'card') {
      return paymentInfo.cardNumber && 
             paymentInfo.expiryDate && 
             paymentInfo.cvv && 
             paymentInfo.cardName;
    }
    return true;
  };

  if (state.cart.length === 0 && !orderProcessed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4">
          <Package className="h-16 w-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold">Tu carrito está vacío</h2>
          <p className="text-muted-foreground">Agrega algunos productos antes de proceder al checkout</p>
          <Button onClick={() => navigate('/products')}>
            Explorar Productos
          </Button>
        </div>
      </div>
    );
  }

  if (orderProcessed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-green-800">¡Pedido Confirmado!</h2>
          <p className="text-green-700">
            Tu pedido ha sido procesado exitosamente. Recibirás un email con los detalles.
          </p>
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 font-medium">
              Número de pedido: #OC-{Date.now()}
            </p>
            <p className="text-sm text-green-600">
              Total pagado: {new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(total)}
            </p>
          </div>
          <p className="text-sm text-green-600">Redirigiendo a tus pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/cart')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm
                ${step.completed 
                  ? 'bg-green-500 text-white' 
                  : currentStep === step.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {step.completed ? <CheckCircle className="h-5 w-5" /> : step.id}
              </div>
              <span className={`ml-2 font-medium ${
                currentStep === step.id ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  step.completed ? 'bg-green-500' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Información de Envío
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Nombre *</label>
                        <Input
                          type="text"
                          placeholder="Juan"
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo(prev => ({...prev, firstName: e.target.value}))}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Apellido *</label>
                        <Input
                          type="text"
                          placeholder="Pérez"
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo(prev => ({...prev, lastName: e.target.value}))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          Email *
                        </label>
                        <Input
                          type="email"
                          placeholder="juan@ejemplo.com"
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo(prev => ({...prev, email: e.target.value}))}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          Teléfono *
                        </label>
                        <Input
                          type="tel"
                          placeholder="+1 (809) 555-0123"
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo(prev => ({...prev, phone: e.target.value}))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Dirección *</label>
                      <Input
                        type="text"
                        placeholder="Calle Principal #123, Ensanche Naco"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo(prev => ({...prev, address: e.target.value}))}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Ciudad *</label>
                        <Input
                          type="text"
                          placeholder="Santo Domingo"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo(prev => ({...prev, city: e.target.value}))}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Provincia</label>
                        <Input
                          type="text"
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo(prev => ({...prev, state: e.target.value}))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Código Postal</label>
                        <Input
                          type="text"
                          placeholder="10101"
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo(prev => ({...prev, zipCode: e.target.value}))}
                        />
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Continuar al Pago
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Método de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Payment method selection */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentInfo.method === 'card' ? 'border-primary bg-primary/10' : 'border-muted'
                      }`}
                      onClick={() => setPaymentInfo(prev => ({...prev, method: 'card'}))}
                    >
                      <div className="text-center">
                        <CreditCard className="h-6 w-6 mx-auto mb-2" />
                        <span className="font-medium">Tarjeta</span>
                      </div>
                    </div>
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentInfo.method === 'paypal' ? 'border-primary bg-primary/10' : 'border-muted'
                      }`}
                      onClick={() => setPaymentInfo(prev => ({...prev, method: 'paypal'}))}
                    >
                      <div className="text-center">
                        <div className="h-6 w-6 mx-auto mb-2 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">PP</div>
                        <span className="font-medium">PayPal</span>
                      </div>
                    </div>
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentInfo.method === 'bank' ? 'border-primary bg-primary/10' : 'border-muted'
                      }`}
                      onClick={() => setPaymentInfo(prev => ({...prev, method: 'bank'}))}
                    >
                      <div className="text-center">
                        <div className="h-6 w-6 mx-auto mb-2 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">B</div>
                        <span className="font-medium">Transferencia</span>
                      </div>
                    </div>
                  </div>

                  {/* Card payment form */}
                  {paymentInfo.method === 'card' && (
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Nombre en la Tarjeta *</label>
                        <Input
                          type="text"
                          placeholder="Juan Pérez"
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo(prev => ({...prev, cardName: e.target.value}))}
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Número de Tarjeta *</label>
                        <Input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo(prev => ({...prev, cardNumber: e.target.value}))}
                          maxLength={19}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Fecha de Vencimiento *</label>
                          <Input
                            type="text"
                            placeholder="MM/AA"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo(prev => ({...prev, expiryDate: e.target.value}))}
                            maxLength={5}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                            CVV *
                            <Lock className="h-3 w-3" />
                          </label>
                          <Input
                            type="text"
                            placeholder="123"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo(prev => ({...prev, cvv: e.target.value}))}
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                        <Shield className="h-5 w-5 text-green-600" />
                        <span className="text-sm">Tus datos de pago están protegidos con SSL</span>
                      </div>

                      <Button type="submit" size="lg" className="w-full">
                        Revisar Pedido
                      </Button>
                    </form>
                  )}

                  {/* Other payment methods */}
                  {paymentInfo.method !== 'card' && (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground mb-4">
                        {paymentInfo.method === 'paypal' 
                          ? 'Serás redirigido a PayPal para completar el pago'
                          : 'Se te proporcionarán los detalles bancarios después de confirmar'
                        }
                      </p>
                      <Button onClick={() => setCurrentStep(3)} size="lg">
                        Continuar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review and Confirm */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revisar Información</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Envío:</h4>
                      <p className="text-sm text-muted-foreground">
                        {shippingInfo.firstName} {shippingInfo.lastName}<br />
                        {shippingInfo.address}<br />
                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                        {shippingInfo.phone}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Pago:</h4>
                      <p className="text-sm text-muted-foreground">
                        {paymentInfo.method === 'card' && `Tarjeta terminada en ${paymentInfo.cardNumber.slice(-4)}`}
                        {paymentInfo.method === 'paypal' && 'PayPal'}
                        {paymentInfo.method === 'bank' && 'Transferencia Bancaria'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  onClick={handleOrderConfirm}
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Procesando...' : 'Confirmar Pedido'}
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart items */}
                <div className="space-y-3">
                  {state.cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img 
                        src={item.images[0]} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium">
                        {new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      Envío
                    </span>
                    <span>
                      {shipping === 0 ? (
                        <Badge variant="secondary">Gratis</Badge>
                      ) : (
                        new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(shipping)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ITBIS (18%)</span>
                    <span>{new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>{new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(total)}</span>
                  </div>
                </div>

                {/* Trust indicators */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Pago 100% Seguro</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span>Envío en 2-3 días</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-purple-600" />
                    <span>30 días para devoluciones</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
