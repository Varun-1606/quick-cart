
import React from "react";
import { Product } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, IndianRupee } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isAdmin, currentUser } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in">
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg p-2">Out of Stock</Badge>
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-primary-200 text-primary-800">{product.category}</Badge>
      </div>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg font-medium">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        <div className="flex items-center font-bold text-lg text-primary-700">
          <IndianRupee className="h-4 w-4 mr-1" />
          {product.price.toFixed(2)}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {!isAdmin && currentUser && product.inStock ? (
          <Button className="w-full" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        ) : isAdmin ? (
          <Button className="w-full" variant="outline" disabled>
            Admin View Only
          </Button>
        ) : !currentUser ? (
          <Button className="w-full" variant="outline" disabled>
            Login to Purchase
          </Button>
        ) : (
          <Button className="w-full" variant="outline" disabled>
            Out of Stock
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
