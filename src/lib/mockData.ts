
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'customer';
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderStatus = 'pending' | 'approved' | 'delivered' | 'rejected';

export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  status: OrderStatus;
  createdAt: Date;
  approvedAt?: Date;
  totalAmount: number;
};

// Sample users
export const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@quickcart.com",
    password: "admin123", // In a real app, this would be hashed
    role: "admin",
  },
  {
    id: "2",
    name: "Test Customer",
    email: "customer@example.com",
    password: "customer123", // In a real app, this would be hashed
    role: "customer",
  },
];

// Sample products
export const products: Product[] = [
  {
    id: "1",
    name: "Fresh Milk",
    description: "Farm-fresh milk, 500ml packet",
    price: 25,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3",
    category: "Dairy",
    inStock: true,
  },
  {
    id: "2",
    name: "Brown Eggs (6 pcs)",
    description: "Organic brown eggs, pack of 6",
    price: 60,
    image: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?ixlib=rb-4.0.3",
    category: "Dairy",
    inStock: true,
  },
  {
    id: "3",
    name: "Whole Wheat Bread",
    description: "Freshly baked whole wheat bread, 400g",
    price: 35,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3",
    category: "Bakery",
    inStock: true,
  },
  {
    id: "4",
    name: "Tomatoes",
    description: "Farm-fresh tomatoes, 500g",
    price: 30,
    image: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?ixlib=rb-4.0.3",
    category: "Vegetables",
    inStock: true,
  },
  {
    id: "5",
    name: "Bananas",
    description: "Ripe yellow bananas, 6 pieces",
    price: 40,
    image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3",
    category: "Fruits",
    inStock: true,
  },
  {
    id: "6",
    name: "Chicken Breast",
    description: "Boneless chicken breast, 500g",
    price: 180,
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3",
    category: "Meat",
    inStock: false,
  },
  {
    id: "7",
    name: "Rice Basmati",
    description: "Premium basmati rice, 1kg",
    price: 120,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3",
    category: "Grains",
    inStock: true,
  },
  {
    id: "8",
    name: "Potato Chips",
    description: "Crispy salted potato chips, 100g",
    price: 30,
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-4.0.3",
    category: "Snacks",
    inStock: true,
  },
];

// Sample orders
export const orders: Order[] = [
  {
    id: "1",
    userId: "2",
    items: [
      { product: products[0], quantity: 2 },
      { product: products[2], quantity: 1 }
    ],
    status: "pending",
    createdAt: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    totalAmount: 85, // 2 milk packets + 1 bread
  },
  {
    id: "2",
    userId: "2",
    items: [
      { product: products[4], quantity: 3 },
      { product: products[7], quantity: 2 }
    ],
    status: "approved",
    createdAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    approvedAt: new Date(Date.now() - 12 * 60000), // 12 minutes ago
    totalAmount: 180, // 3 banana packs + 2 chips
  },
  {
    id: "3",
    userId: "2",
    items: [
      { product: products[3], quantity: 4 },
      { product: products[1], quantity: 1 }
    ],
    status: "delivered",
    createdAt: new Date(Date.now() - 60 * 60000), // 1 hour ago
    approvedAt: new Date(Date.now() - 55 * 60000), // 55 minutes ago
    totalAmount: 180, // 4 tomato packs + 1 egg pack
  }
];
