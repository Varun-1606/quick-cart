import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, Order, orders } from "../lib/mockData";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
  totalItems: number;
  totalAmount: number;
  placeOrder: () => boolean;
  userOrders: Order[];
  initiateCheckout: () => Promise<string | null>;
  isProcessingPayment: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { currentUser, isAdmin } = useAuth();
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Load cart from localStorage on mount and when user changes
  useEffect(() => {
    if (currentUser && !isAdmin) {
      const savedCart = localStorage.getItem(`cart-${currentUser.id}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, [currentUser, isAdmin]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (currentUser && !isAdmin) {
      localStorage.setItem(`cart-${currentUser.id}`, JSON.stringify(cartItems));
    }
    
    // Calculate totals
    const items = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const amount = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    setTotalItems(items);
    setTotalAmount(amount);
  }, [cartItems, currentUser, isAdmin]);

  // Persist orders state to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      const userOrders = orders.filter(order => order.userId === currentUser.id);
      localStorage.setItem(`orders-${currentUser.id}`, JSON.stringify(userOrders));
    }
  }, [orders, currentUser]);

  // Load persisted orders from localStorage when component mounts
  useEffect(() => {
    // This effect ensures that our mock data (orders array) has the correct order status and timestamps
    // after page refresh by syncing it with localStorage
    if (currentUser) {
      const savedOrders = localStorage.getItem(`orders-${currentUser.id}`);
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        
        // Update the global orders array with saved data
        parsedOrders.forEach((savedOrder: Order) => {
          const orderIndex = orders.findIndex(o => o.id === savedOrder.id);
          if (orderIndex !== -1) {
            // Convert string dates back to Date objects
            const approvedAt = savedOrder.approvedAt ? new Date(savedOrder.approvedAt) : undefined;
            orders[orderIndex] = {
              ...savedOrder,
              createdAt: new Date(savedOrder.createdAt),
              approvedAt
            };
          } else {
            // If order doesn't exist in orders array (might be a new one), add it
            const processedOrder = {
              ...savedOrder,
              createdAt: new Date(savedOrder.createdAt),
              approvedAt: savedOrder.approvedAt ? new Date(savedOrder.approvedAt) : undefined
            };
            orders.push(processedOrder);
          }
        });
      }
    }
  }, [currentUser]);

  const addToCart = (product: Product, quantity = 1) => {
    if (isAdmin) {
      toast.error("Admin cannot add items to cart");
      return;
    }
    
    if (!currentUser) {
      toast.error("Please login to add items to cart");
      return;
    }
    
    if (!product.inStock) {
      toast.error("Product is out of stock");
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
    
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    toast.success("Item removed from cart");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const placeOrder = (): boolean => {
    if (isAdmin) {
      toast.error("Admin cannot place orders");
      return false;
    }
    
    if (!currentUser) {
      toast.error("Please login to place an order");
      return false;
    }
    
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }

    // Create new order
    const newOrder: Order = {
      id: (orders.length + 1).toString(),
      userId: currentUser.id,
      items: [...cartItems],
      status: 'pending',
      createdAt: new Date(),
      totalAmount: totalAmount
    };
    
    // Add order to orders array
    orders.push(newOrder);
    
    // Update localStorage with the new order
    const userOrders = orders.filter(order => order.userId === currentUser.id);
    localStorage.setItem(`orders-${currentUser.id}`, JSON.stringify(userOrders));
    
    // Clear the cart
    clearCart();
    
    toast.success("Order placed successfully!");
    return true;
  };

  // Initiate Stripe checkout
  const initiateCheckout = async (): Promise<string | null> => {
    if (isAdmin) {
      toast.error("Admin cannot place orders");
      return null;
    }
    
    if (!currentUser) {
      toast.error("Please login to place an order");
      return null;
    }
    
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return null;
    }

    setIsProcessingPayment(true);

    try {
      // In a real app, this would be a call to your backend to create a Stripe checkout session
      // For this demo, we're simulating the checkout URL creation
      
      // Mock checkout URL (in a real app, this would come from your server)
      const checkoutUrl = `https://checkout.stripe.com/mock-checkout?session=demo_${Date.now()}`;
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsProcessingPayment(false);
      return checkoutUrl;
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Failed to initiate payment process");
      setIsProcessingPayment(false);
      return null;
    }
  };

  // Get user orders
  const userOrders = currentUser 
    ? orders.filter(order => order.userId === currentUser.id)
    : [];

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      updateQuantity,
      totalItems,
      totalAmount,
      placeOrder,
      userOrders,
      initiateCheckout,
      isProcessingPayment
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
