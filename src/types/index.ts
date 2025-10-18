// User types
export type UserRole = 'farmer' | 'customer' | 'retailer' | 'storage_provider';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FarmerProfile {
  userId: string;
  farmSize: string;
  location: string;
  specialization: string[];
  rating: number;
  totalOrders: number;
  monthlyRevenue: number;
  verified: boolean;
}

export interface CustomerProfile {
  userId: string;
  address: string;
  preferredCategories: string[];
  orderHistory: string[];
}

export interface RetailerProfile {
  userId: string;
  businessName: string;
  businessType: string;
  gstNumber?: string;
  address: string;
}

export interface StorageProviderProfile {
  userId: string;
  companyName: string;
  facilities: string[];
  capacity: number;
  location: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  nameTamil: string;
  description?: string;
  category: ProductCategory;
  price: number;
  unit: ProductUnit;
  stock: number;
  farmerId: string;
  farmerName: string;
  images: string[];
  healthBenefits: string;
  rating: number;
  reviewCount: number;
  availability: boolean;
  harvestDate?: Date;
  expiryDate?: Date;
  organic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCategory = 
  | 'vegetables' 
  | 'fruits' 
  | 'grains' 
  | 'pulses' 
  | 'spices' 
  | 'leafy_greens' 
  | 'dairy' 
  | 'herbs';

export type ProductUnit = 'kg' | 'grams' | 'liters' | 'pieces' | 'bundles' | 'dozens';

// Order types
export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  priceAtTime: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderDate: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'packed' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// Address type
export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  landmark?: string;
}

// Warehouse types
export interface Warehouse {
  id: string;
  name: string;
  providerId: string;
  providerName: string;
  location: Address;
  capacity: number;
  availableSpace: number;
  features: string[];
  pricePerMonth: number;
  contactNumber: string;
  images: string[];
  rating: number;
  availability: boolean;
  createdAt: Date;
}

// Cart types
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId?: string;
  farmerId?: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  phone?: string;
}

export interface ProductFormData {
  name: string;
  nameTamil: string;
  description?: string;
  category: ProductCategory;
  price: number;
  unit: ProductUnit;
  stock: number;
  healthBenefits: string;
  organic: boolean;
  images: File[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Search and Filter types
export interface SearchFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  organic?: boolean;
  sortBy?: 'price' | 'rating' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Dashboard types
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  rating: number;
  recentOrders: Order[];
  topProducts: Product[];
}