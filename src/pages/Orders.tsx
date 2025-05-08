
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndianRupee, Clock, Check, X, Package } from "lucide-react";

const OrderStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending Approval</Badge>;
    case 'approved':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Out for Delivery</Badge>;
    case 'delivered':
      return <Badge className="bg-green-500">Delivered</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const calculateTimeRemaining = (approvedAt: Date | undefined) => {
  if (!approvedAt) return 0;
  
  const now = new Date();
  const deliveryTime = new Date(approvedAt.getTime() + 10 * 60000); // 10 minutes after approval
  const remainingMs = deliveryTime.getTime() - now.getTime();
  
  return Math.max(0, Math.floor(remainingMs / 1000));
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const Orders: React.FC = () => {
  const { userOrders } = useCart();
  const { currentUser } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});
  
  // Group orders by status
  const pendingOrders = userOrders.filter(order => order.status === 'pending');
  const approvedOrders = userOrders.filter(order => order.status === 'approved');
  const deliveredOrders = userOrders.filter(order => order.status === 'delivered');
  const rejectedOrders = userOrders.filter(order => order.status === 'rejected');
  
  // Setup countdown timer for approved orders
  useEffect(() => {
    const timers: Record<string, number> = {};
    
    approvedOrders.forEach(order => {
      if (order.approvedAt) {
        timers[order.id] = calculateTimeRemaining(order.approvedAt);
      }
    });
    
    setTimeRemaining(timers);
    
    const intervalId = setInterval(() => {
      setTimeRemaining(prev => {
        const updated = { ...prev };
        
        Object.keys(updated).forEach(orderId => {
          updated[orderId] = Math.max(0, updated[orderId] - 1);
        });
        
        return updated;
      });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [approvedOrders]);

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Please Login</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">You need to be logged in to view your orders</p>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userOrders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-center">No Orders Yet</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">You haven't placed any orders yet</p>
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
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">All Orders ({userOrders.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="approved">Out for Delivery ({approvedOrders.length})</TabsTrigger>
          <TabsTrigger value="delivered">Delivered ({deliveredOrders.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedOrders.length})</TabsTrigger>
        </TabsList>

        {/* All Orders Tab */}
        <TabsContent value="all">
          <div className="space-y-6">
            {userOrders.length === 0 ? (
              <p className="text-center text-gray-500">No orders found</p>
            ) : (
              userOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Package className="mr-2 h-5 w-5" />
                          Order #{order.id}
                        </CardTitle>
                        <CardDescription>
                          Placed on {order.createdAt.toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.product.id} className="flex items-center">
                          <div className="w-16 h-16 mr-4">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium">{item.product.name}</h3>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="flex items-center font-medium">
                            <IndianRupee className="h-3 w-3 mr-1" />
                            {(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Amount:</span>
                        <div className="flex items-center font-bold text-lg">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          {order.totalAmount.toFixed(2)}
                        </div>
                      </div>
                      
                      {/* Show delivery countdown for approved orders */}
                      {order.status === 'approved' && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-md flex items-center">
                          <Clock className="h-5 w-5 text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm text-blue-700">Estimated delivery in:</p>
                            <p className="font-bold text-blue-900">
                              {timeRemaining[order.id] ? formatTime(timeRemaining[order.id]) : '0:00'}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Show delivery time for delivered orders */}
                      {order.status === 'delivered' && (
                        <div className="mt-4 p-3 bg-green-50 rounded-md flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <p className="text-green-700">
                            Delivered on {order.approvedAt?.toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      
                      {/* Show rejection message for rejected orders */}
                      {order.status === 'rejected' && (
                        <div className="mt-4 p-3 bg-red-50 rounded-md flex items-center">
                          <X className="h-5 w-5 text-red-500 mr-2" />
                          <p className="text-red-700">
                            Order was rejected. Some items may be out of stock.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        {/* Pending Orders Tab */}
        <TabsContent value="pending">
          <div className="space-y-6">
            {pendingOrders.length === 0 ? (
              <p className="text-center text-gray-500">No pending orders</p>
            ) : (
              pendingOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Package className="mr-2 h-5 w-5" />
                          Order #{order.id}
                        </CardTitle>
                        <CardDescription>
                          Placed on {order.createdAt.toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.product.id} className="flex items-center">
                          <div className="w-16 h-16 mr-4">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium">{item.product.name}</h3>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="flex items-center font-medium">
                            <IndianRupee className="h-3 w-3 mr-1" />
                            {(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Amount:</span>
                        <div className="flex items-center font-bold text-lg">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          {order.totalAmount.toFixed(2)}
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-yellow-50 rounded-md flex items-center">
                        <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                        <p className="text-yellow-700">
                          Awaiting admin approval. You'll be notified once your order is approved.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        {/* Approved Orders Tab */}
        <TabsContent value="approved">
          <div className="space-y-6">
            {approvedOrders.length === 0 ? (
              <p className="text-center text-gray-500">No orders in delivery</p>
            ) : (
              approvedOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Package className="mr-2 h-5 w-5" />
                          Order #{order.id}
                        </CardTitle>
                        <CardDescription>
                          Placed on {order.createdAt.toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.product.id} className="flex items-center">
                          <div className="w-16 h-16 mr-4">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium">{item.product.name}</h3>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="flex items-center font-medium">
                            <IndianRupee className="h-3 w-3 mr-1" />
                            {(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Amount:</span>
                        <div className="flex items-center font-bold text-lg">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          {order.totalAmount.toFixed(2)}
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-blue-50 rounded-md flex items-center">
                        <Clock className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <p className="text-sm text-blue-700">Estimated delivery in:</p>
                          <p className="font-bold text-blue-900">
                            {timeRemaining[order.id] ? formatTime(timeRemaining[order.id]) : '0:00'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        {/* Delivered Orders Tab */}
        <TabsContent value="delivered">
          <div className="space-y-6">
            {deliveredOrders.length === 0 ? (
              <p className="text-center text-gray-500">No delivered orders</p>
            ) : (
              deliveredOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Package className="mr-2 h-5 w-5" />
                          Order #{order.id}
                        </CardTitle>
                        <CardDescription>
                          Placed on {order.createdAt.toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.product.id} className="flex items-center">
                          <div className="w-16 h-16 mr-4">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium">{item.product.name}</h3>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="flex items-center font-medium">
                            <IndianRupee className="h-3 w-3 mr-1" />
                            {(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Amount:</span>
                        <div className="flex items-center font-bold text-lg">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          {order.totalAmount.toFixed(2)}
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-green-50 rounded-md flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <p className="text-green-700">
                          Delivered on {order.approvedAt?.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        {/* Rejected Orders Tab */}
        <TabsContent value="rejected">
          <div className="space-y-6">
            {rejectedOrders.length === 0 ? (
              <p className="text-center text-gray-500">No rejected orders</p>
            ) : (
              rejectedOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Package className="mr-2 h-5 w-5" />
                          Order #{order.id}
                        </CardTitle>
                        <CardDescription>
                          Placed on {order.createdAt.toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.product.id} className="flex items-center">
                          <div className="w-16 h-16 mr-4">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium">{item.product.name}</h3>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="flex items-center font-medium">
                            <IndianRupee className="h-3 w-3 mr-1" />
                            {(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Amount:</span>
                        <div className="flex items-center font-bold text-lg">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          {order.totalAmount.toFixed(2)}
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-red-50 rounded-md flex items-center">
                        <X className="h-5 w-5 text-red-500 mr-2" />
                        <p className="text-red-700">
                          Order was rejected. Some items may be out of stock.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Orders;
