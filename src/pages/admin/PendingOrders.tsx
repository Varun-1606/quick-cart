
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { orders as allOrders, Order, users } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { IndianRupee, Clock, Check, X, Package, User } from "lucide-react";
import { toast } from "sonner";

const PendingOrders: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [approvedOrders, setApprovedOrders] = useState<Order[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([]);
  const [rejectedOrders, setRejectedOrders] = useState<Order[]>([]);

  // Filter orders by status
  useEffect(() => {
    const filterOrders = () => {
      setPendingOrders(allOrders.filter(order => order.status === 'pending'));
      setApprovedOrders(allOrders.filter(order => order.status === 'approved'));
      setDeliveredOrders(allOrders.filter(order => order.status === 'delivered'));
      setRejectedOrders(allOrders.filter(order => order.status === 'rejected'));
    };
    
    filterOrders();
    
    // Check for approved orders that need to be marked as delivered (after 10 minutes)
    const intervalId = setInterval(() => {
      const now = new Date();
      
      allOrders.forEach(order => {
        if (
          order.status === 'approved' && 
          order.approvedAt && 
          now.getTime() - order.approvedAt.getTime() >= 10 * 60000 // 10 minutes
        ) {
          order.status = 'delivered';
          filterOrders(); // Refresh the filtered lists
        }
      });
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  // Helper function to get customer name from userId
  const getCustomerName = (userId: string) => {
    const user = users.find(user => user.id === userId);
    return user ? user.name : `User #${userId}`;
  };

  // Handle approve order
  const handleApproveOrder = () => {
    if (!selectedOrder) return;
    
    const orderIndex = allOrders.findIndex(order => order.id === selectedOrder.id);
    if (orderIndex !== -1) {
      allOrders[orderIndex].status = 'approved';
      allOrders[orderIndex].approvedAt = new Date();
      
      // Update filtered lists
      setPendingOrders(allOrders.filter(order => order.status === 'pending'));
      setApprovedOrders(allOrders.filter(order => order.status === 'approved'));
      
      toast.success(`Order #${selectedOrder.id} has been approved`);
      setIsDetailsDialogOpen(false);
    }
  };
  
  // Handle reject order
  const handleRejectOrder = () => {
    if (!selectedOrder) return;
    
    const orderIndex = allOrders.findIndex(order => order.id === selectedOrder.id);
    if (orderIndex !== -1) {
      allOrders[orderIndex].status = 'rejected';
      
      // Update filtered lists
      setPendingOrders(allOrders.filter(order => order.status === 'pending'));
      setRejectedOrders(allOrders.filter(order => order.status === 'rejected'));
      
      toast.success(`Order #${selectedOrder.id} has been rejected`);
      setIsDetailsDialogOpen(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Orders</h1>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Link to="/admin">
            <Button variant="outline">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-6 w-full justify-start overflow-x-auto">
          <TabsTrigger value="pending" className="px-4 py-2">
            Pending Orders ({pendingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="px-4 py-2">
            In Delivery ({approvedOrders.length})
          </TabsTrigger>
          <TabsTrigger value="delivered" className="px-4 py-2">
            Delivered ({deliveredOrders.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="px-4 py-2">
            Rejected ({rejectedOrders.length})
          </TabsTrigger>
        </TabsList>
        
        {/* Pending Orders Tab */}
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-lg font-medium">No Pending Orders</h3>
                  <p className="text-gray-500">
                    All customer orders have been processed
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.id}</TableCell>
                        <TableCell className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>{getCustomerName(order.userId)}</span>
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell className="text-right font-medium">
                          <div className="flex items-center justify-end">
                            <IndianRupee className="h-3 w-3 mr-1" />
                            {order.totalAmount.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog open={isDetailsDialogOpen && selectedOrder?.id === order.id} onOpenChange={(open) => {
                            setIsDetailsDialogOpen(open);
                            if (open) setSelectedOrder(order);
                          }}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">View Details</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Order Details</DialogTitle>
                                <DialogDescription>
                                  Review order #{order.id} and approve or reject
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4 space-y-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-sm text-gray-500">Customer</p>
                                    <p>{getCustomerName(order.userId)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Order Date</p>
                                    <p>{formatDate(order.createdAt)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <OrderStatusBadge status={order.status} />
                                  </div>
                                </div>
                                
                                <div className="border rounded-lg overflow-hidden">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Subtotal</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {order.items.map((item) => (
                                        <TableRow key={item.product.id}>
                                          <TableCell>
                                            <div className="flex items-center space-x-2">
                                              <div className="w-10 h-10">
                                                <img
                                                  src={item.product.image}
                                                  alt={item.product.name}
                                                  className="w-full h-full object-cover rounded"
                                                />
                                              </div>
                                              <span>{item.product.name}</span>
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-right">{item.quantity}</TableCell>
                                          <TableCell className="text-right">
                                            <div className="flex items-center justify-end">
                                              <IndianRupee className="h-3 w-3 mr-1" />
                                              {item.product.price.toFixed(2)}
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-right font-medium">
                                            <div className="flex items-center justify-end">
                                              <IndianRupee className="h-3 w-3 mr-1" />
                                              {(item.product.price * item.quantity).toFixed(2)}
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <div className="flex justify-end items-center space-x-4">
                                    <span className="font-medium">Total Amount:</span>
                                    <div className="flex items-center font-bold text-lg">
                                      <IndianRupee className="h-4 w-4 mr-1" />
                                      {order.totalAmount.toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter className="flex justify-between">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  onClick={handleRejectOrder}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Reject Order
                                </Button>
                                <DialogClose asChild>
                                  <Button type="button" variant="outline">
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <Button
                                  type="button"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={handleApproveOrder}
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Approve Order
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Approved/In Delivery Orders Tab */}
        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Orders in Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              {approvedOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-lg font-medium">No Orders in Delivery</h3>
                  <p className="text-gray-500">All approved orders have been delivered</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Approved At</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Delivery Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedOrders.map((order) => {
                      // Calculate time remaining for delivery
                      const approvalTime = order.approvedAt || new Date();
                      const deliveryTime = new Date(approvalTime.getTime() + 10 * 60000); // 10 minutes
                      const now = new Date();
                      const remainingMs = deliveryTime.getTime() - now.getTime();
                      const remainingMins = Math.max(0, Math.floor(remainingMs / 60000));
                      const remainingSecs = Math.max(0, Math.floor((remainingMs % 60000) / 1000));
                      
                      return (
                        <TableRow key={order.id}>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span>{getCustomerName(order.userId)}</span>
                          </TableCell>
                          <TableCell>{formatDate(order.approvedAt || new Date())}</TableCell>
                          <TableCell>{order.items.length} items</TableCell>
                          <TableCell className="text-right font-medium">
                            <div className="flex items-center justify-end">
                              <IndianRupee className="h-3 w-3 mr-1" />
                              {order.totalAmount.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-blue-500" />
                              <span>
                                {remainingMins}:{remainingSecs < 10 ? '0' : ''}{remainingSecs} remaining
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Delivered Orders Tab */}
        <TabsContent value="delivered">
          <Card>
            <CardHeader>
              <CardTitle>Delivered Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {deliveredOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-lg font-medium">No Delivered Orders</h3>
                  <p className="text-gray-500">Orders will appear here once delivered</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Ordered At</TableHead>
                      <TableHead>Delivered At</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliveredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.id}</TableCell>
                        <TableCell className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>{getCustomerName(order.userId)}</span>
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>{formatDate(order.approvedAt || new Date())}</TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell className="text-right font-medium">
                          <div className="flex items-center justify-end">
                            <IndianRupee className="h-3 w-3 mr-1" />
                            {order.totalAmount.toFixed(2)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Rejected Orders Tab */}
        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {rejectedOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-lg font-medium">No Rejected Orders</h3>
                  <p className="text-gray-500">No orders have been rejected yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Ordered At</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejectedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.id}</TableCell>
                        <TableCell className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>{getCustomerName(order.userId)}</span>
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell className="text-right font-medium">
                          <div className="flex items-center justify-end">
                            <IndianRupee className="h-3 w-3 mr-1" />
                            {order.totalAmount.toFixed(2)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PendingOrders;
