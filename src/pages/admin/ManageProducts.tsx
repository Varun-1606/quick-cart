
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { products as allProducts, Product } from "@/lib/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash2, Plus, IndianRupee, Eye, EyeOff, Check, X } from "lucide-react";
import { toast } from "sonner";

const ManageProducts: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form states for add/edit product
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "",
    inStock: true
  });
  
  // Search functionality
  useEffect(() => {
    if (searchTerm) {
      const filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProducts(filteredProducts);
    } else {
      setProducts(allProducts);
    }
  }, [searchTerm]);
  
  // Set form data when editing a product
  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        id: selectedProduct.id,
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price,
        image: selectedProduct.image,
        category: selectedProduct.category,
        inStock: selectedProduct.inStock
      });
    }
  }, [selectedProduct]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) : value
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      inStock: checked
    });
  };
  
  // Handle add product submit
  const handleAddProduct = () => {
    // Validation
    if (!formData.name || !formData.description || !formData.price || !formData.image || !formData.category) {
      toast.error("All fields are required");
      return;
    }
    
    const newProduct = {
      ...formData,
      id: (allProducts.length + 1).toString() // Generate a new ID
    };
    
    allProducts.push(newProduct);
    setProducts([...allProducts]);
    setIsAddDialogOpen(false);
    toast.success("Product added successfully");
    
    // Reset form data
    setFormData({
      id: "",
      name: "",
      description: "",
      price: 0,
      image: "",
      category: "",
      inStock: true
    });
  };
  
  // Handle edit product submit
  const handleEditProduct = () => {
    // Validation
    if (!formData.name || !formData.description || !formData.price || !formData.image || !formData.category) {
      toast.error("All fields are required");
      return;
    }
    
    const updatedProducts = products.map(product => 
      product.id === formData.id ? { ...formData } : product
    );
    
    // Update the products array
    const index = allProducts.findIndex(p => p.id === formData.id);
    if (index !== -1) {
      allProducts[index] = { ...formData };
    }
    
    setProducts(updatedProducts);
    setIsEditDialogOpen(false);
    toast.success("Product updated successfully");
  };
  
  // Handle delete product
  const handleDeleteProduct = () => {
    if (!selectedProduct) return;
    
    const updatedProducts = products.filter(product => product.id !== selectedProduct.id);
    
    // Remove from the allProducts array
    const index = allProducts.findIndex(p => p.id === selectedProduct.id);
    if (index !== -1) {
      allProducts.splice(index, 1);
    }
    
    setProducts(updatedProducts);
    setIsDeleteDialogOpen(false);
    toast.success("Product deleted successfully");
  };
  
  // Handle toggle stock status
  const handleToggleStockStatus = (product: Product) => {
    const updatedProduct = { ...product, inStock: !product.inStock };
    
    const updatedProducts = products.map(p => 
      p.id === product.id ? updatedProduct : p
    );
    
    // Update the allProducts array
    const index = allProducts.findIndex(p => p.id === product.id);
    if (index !== -1) {
      allProducts[index] = updatedProduct;
    }
    
    setProducts(updatedProducts);
    toast.success(`Product marked as ${updatedProduct.inStock ? 'In Stock' : 'Out of Stock'}`);
  };

  if (!currentUser || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">You don't have permission to access this page</p>
            <Link to="/">
              <Button>Go to Homepage</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Link to="/admin">
            <Button variant="outline">
              Back to Dashboard
            </Button>
          </Link>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new product to the catalog
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price (₹)
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">
                    Image URL
                  </Label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="inStock" className="text-right">
                    In Stock
                  </Label>
                  <Switch
                    id="inStock"
                    checked={formData.inStock}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="button" onClick={handleAddProduct}>
                  Add Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search products by name, description, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            Manage your product catalog - {products.length} products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="w-16 h-16">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[250px]">
                        {product.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <div className="flex items-center justify-end">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      {product.price.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.inStock ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        <Check className="h-3 w-3 mr-1" />
                        In Stock
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">
                        <X className="h-3 w-3 mr-1" />
                        Out of Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStockStatus(product)}
                        title={product.inStock ? "Mark as Out of Stock" : "Mark as In Stock"}
                      >
                        {product.inStock ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedProduct(product)}
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px]">
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                            <DialogDescription>
                              Make changes to the product details
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="edit-name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-description" className="text-right">
                                Description
                              </Label>
                              <Textarea
                                id="edit-description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-price" className="text-right">
                                Price (₹)
                              </Label>
                              <Input
                                id="edit-price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-image" className="text-right">
                                Image URL
                              </Label>
                              <Input
                                id="edit-image"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-category" className="text-right">
                                Category
                              </Label>
                              <Input
                                id="edit-category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-inStock" className="text-right">
                                In Stock
                              </Label>
                              <Switch
                                id="edit-inStock"
                                checked={formData.inStock}
                                onCheckedChange={handleSwitchChange}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="outline">
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button type="button" onClick={handleEditProduct}>
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedProduct(product)}
                            title="Delete Product"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this product? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex items-center space-x-4 py-4">
                            <div className="w-16 h-16">
                              <img
                                src={selectedProduct?.image}
                                alt={selectedProduct?.name}
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{selectedProduct?.name}</h3>
                              <p className="text-sm text-gray-500">{selectedProduct?.category}</p>
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="outline">
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={handleDeleteProduct}
                            >
                              Delete Product
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-gray-500">
            Showing {products.length} of {allProducts.length} products
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ManageProducts;
