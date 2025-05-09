
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { ShoppingCart, User, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const NavBar: React.FC = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-primary-600 text-2xl font-bold">Quick Cart</span>
          <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">10 min</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
            Home
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-primary-600 transition-colors">
            Products
          </Link>
          {currentUser && !isAdmin && (
            <Link to="/orders" className="text-gray-700 hover:text-primary-600 transition-colors">
              My Orders
            </Link>
          )}
          {isAdmin && (
            <>
              <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/admin/products" className="text-gray-700 hover:text-primary-600 transition-colors">
                Manage Products
              </Link>
              <Link to="/admin/orders" className="text-gray-700 hover:text-primary-600 transition-colors">
                Pending Orders
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 hidden md:inline">
                {currentUser.name}
              </span>
              {!isAdmin && (
                <Link to="/cart" className="relative">
                  <ShoppingCart className="h-6 w-6 text-gray-700" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/register">
                <Button size="sm" className="bg-primary-500 hover:bg-primary-600 text-white">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
