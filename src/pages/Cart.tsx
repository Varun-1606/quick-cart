
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Plus, Minus, Trash2, CreditCard, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const Cart: React.FC = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    totalAmount, 
    placeOrder, 
    initiateCheckout, 
    isProcessingPayment 
  } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online');

  const form = useForm({
    defaultValues: {
      paymentMethod: 'online',
    },
  });

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    if (paymentMethod === 'cod') {
      // Cash on delivery
      const success = placeOrder();
      if (success) {
        navigate("/orders");
      }
    } else {
      // Online payment
      const checkoutUrl = await initiateCheckout();
      if (checkoutUrl) {
        // In a real implementation, redirect to the Stripe checkout URL
        toast.success("Redirecting to payment gateway...");
        
        // This would redirect to Stripe in a real implementation
        // window.location.href = checkoutUrl;
        
        // For this demo, simulate successful payment after a delay
        setTimeout(() => {
          const success = placeOrder();
          if (success) {
            navigate("/orders");
          }
        }, 2000);
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Please Login</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">You need to be logged in to view your cart</p>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Your Cart is Empty</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">Add some products to your cart to get started</p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.product.id} 
                  className="flex flex-col sm:flex-row items-center border-b border-gray-200 pb-4"
                >
                  <div className="w-24 h-24 mr-4 mb-4 sm:mb-0">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover rounded" 
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">{item.product.description}</p>
                    <div className="flex items-center text-primary-700 mt-1">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      <span>{item.product.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-4 sm:mt-0">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-3">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 ml-4"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Items:</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery:</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <div className="flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  <span>{totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium mb-3">Payment Method</h3>
                
                <RadioGroup 
                  defaultValue="online"
                  value={paymentMethod} 
                  onValueChange={(value) => setPaymentMethod(value as 'cod' | 'online')}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Online Payment (Credit/Debit Card, UPI)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Cash on Delivery
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handlePlaceOrder}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : paymentMethod === 'online' ? (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Now
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
