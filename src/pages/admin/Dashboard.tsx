
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, Clock, Check, X, IndianRupee } from "lucide-react";
import { orders, products } from "@/lib/mockData";

const AdminDashboard: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  
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

  // Count orders by status
  const pendingOrdersCount = orders.filter(order => order.status === 'pending').length;
  const approvedOrdersCount = orders.filter(order => order.status === 'approved').length;
  const deliveredOrdersCount = orders.filter(order => order.status === 'delivered').length;
  const rejectedOrdersCount = orders.filter(order => order.status === 'rejected').length;
  
  // Count in stock/out of stock products
  const inStockCount = products.filter(product => product.inStock).length;
  const outOfStockCount = products.filter(product => !product.inStock).length;
  
  // Calculate total revenue
  const totalRevenue = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Link to="/admin/products">
            <Button variant="outline">
              Manage Products
            </Button>
          </Link>
          <Link to="/admin/orders">
            <Button>
              View Pending Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-2">
            <CardDescription>Pending Orders</CardDescription>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-amber-500" />
              {pendingOrdersCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">
              Orders awaiting approval
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="flex items-center">
              <IndianRupee className="mr-2 h-5 w-5 text-green-500" />
              {totalRevenue.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">
              From {deliveredOrdersCount} delivered orders
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="pb-2">
            <CardDescription>Products In Stock</CardDescription>
            <CardTitle className="flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5 text-purple-500" />
              {inStockCount} / {products.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">
              {outOfStockCount} products out of stock
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-white">
          <CardHeader className="pb-2">
            <CardDescription>Orders In Delivery</CardDescription>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-blue-500" />
              {approvedOrdersCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500">
              Currently being delivered
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center p-4 bg-amber-50 rounded-lg">
              <Clock className="h-8 w-8 text-amber-500 mb-2" />
              <span className="text-2xl font-bold">{pendingOrdersCount}</span>
              <span className="text-sm text-gray-500">Pending</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
              <Package className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-2xl font-bold">{approvedOrdersCount}</span>
              <span className="text-sm text-gray-500">In Delivery</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
              <Check className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-2xl font-bold">{deliveredOrdersCount}</span>
              <span className="text-sm text-gray-500">Delivered</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg">
              <X className="h-8 w-8 text-red-500 mb-2" />
              <span className="text-2xl font-bold">{rejectedOrdersCount}</span>
              <span className="text-sm text-gray-500">Rejected</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/orders">
              <Button className="w-full" variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Process Pending Orders ({pendingOrdersCount})
              </Button>
            </Link>
            <Link to="/admin/products">
              <Button className="w-full" variant="outline">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Manage Inventory
              </Button>
            </Link>
            <Link to="/products">
              <Button className="w-full" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                View Product Catalog
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
