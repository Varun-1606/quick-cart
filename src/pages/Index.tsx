import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Clock, ShoppingBag, Truck, Star } from "lucide-react";
import { products } from "@/lib/mockData";
import ProductCard from "@/components/ProductCard";

const Index = () => {
  const { currentUser, isAdmin } = useAuth();
  
  // Display only a subset of products on the homepage
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-in">
                Groceries Delivered in <span className="text-yellow-300">10 Minutes</span>
              </h1>
              <p className="text-lg md:text-xl mb-6 animate-slide-in" style={{animationDelay: "0.1s"}}>
                Fresh produce, daily essentials, and more delivered to your doorstep in just 10 minutes.
              </p>
              <div className="flex space-x-4 animate-slide-in" style={{animationDelay: "0.2s"}}>
                {!currentUser ? (
                  <Link to="/register">
                    <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                      Sign Up
                    </Button>
                  </Link>
                ) : isAdmin ? (
                  <Link to="/admin">
                    <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                      Admin Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/products">
                    <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                      Shop Now
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center animate-fade-in">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3" 
                alt="Grocery Delivery" 
                className="rounded-lg shadow-xl max-w-full h-auto" 
                style={{maxHeight: "400px"}}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Quick Cart?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center animate-fade-in">
              <div className="bg-primary-100 p-3 rounded-full mb-4">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ultra-Fast Delivery</h3>
              <p className="text-gray-600">Get your groceries delivered in just 10 minutes, right when you need them.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center animate-fade-in" style={{animationDelay: "0.1s"}}>
              <div className="bg-primary-100 p-3 rounded-full mb-4">
                <ShoppingBag className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Curated Selection</h3>
              <p className="text-gray-600">Handpicked fresh produce, essentials, and daily needs all in one place.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center animate-fade-in" style={{animationDelay: "0.2s"}}>
              <div className="bg-primary-100 p-3 rounded-full mb-4">
                <Truck className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Delivery</h3>
              <p className="text-gray-600">No minimum order value, enjoy free delivery on all your orders.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products">
              <Button variant="outline" className="hover:bg-primary-500 hover:text-white transition-all">
                View All Products
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Customers Love Quick Cart</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm animate-fade-in">
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-gray-600 mb-4">"Incredible service! I received my groceries in just 8 minutes. The quality was excellent, and the app is so easy to use."</p>
              <p className="font-semibold">- Rajesh M.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm animate-fade-in" style={{animationDelay: "0.1s"}}>
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-gray-600 mb-4">"Quick Cart has been a lifesaver! Fresh produce delivered to my door in minutes. No more last-minute grocery runs."</p>
              <p className="font-semibold">- Priya K.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm animate-fade-in" style={{animationDelay: "0.2s"}}>
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-gray-600 mb-4">"The fastest delivery service I've ever used. Great selection of products and fantastic customer service. Highly recommend!"</p>
              <p className="font-semibold">- Amit S.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experience the fastest grocery delivery in town. Your essentials are just minutes away.
          </p>
          {!currentUser ? (
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Get Started Now
              </Button>
            </Link>
          ) : !isAdmin ? (
            <Link to="/products">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Shop Now
              </Button>
            </Link>
          ) : (
            <Link to="/admin">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Go to Dashboard
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Cart</h3>
              <p className="text-gray-300">
                Groceries delivered in 10 minutes or less. Serving fresh, quality products right to your doorstep.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
                <li><Link to="/products" className="text-gray-300 hover:text-white">Products</Link></li>
                <li><Link to="/login" className="text-gray-300 hover:text-white">Login</Link></li>
                <li><Link to="/register" className="text-gray-300 hover:text-white">Register</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-gray-300">
                123 Delivery Street<br />
                Bangalore, Karnataka<br />
                India<br />
                support@quickcart.com
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-gray-400">© 2023 Quick Cart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
