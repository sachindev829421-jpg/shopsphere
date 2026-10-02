export type Role = "CUSTOMER" | "ADMIN";

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  image?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  street: string;
  apartment?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  featured: boolean;
  productsCount?: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt?: string | null;
  order: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  size?: string | null;
  color?: string | null;
  price?: number | null;
  stockQuantity: number;
  image?: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  shortDescription?: string | null;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  discount: number;
  stockQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  categoryId: string;
  category?: Category;
  subcategory?: string | null;
  tags: string[]; // parsed from JSON
  specifications: Record<string, string>; // parsed from JSON
  sizes: string[]; // parsed from JSON
  colors: string[]; // parsed from JSON
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string | null;
  name: string;
  image: string;
  price: number;
  compareAtPrice?: number | null;
  quantity: number;
  size?: string | null;
  color?: string | null;
  maxStock: number;
  sku: string;
  slug: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number | null;
  isActive: boolean;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "REFUNDED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string | null;
  variantId?: string | null;
  productName: string;
  productImage?: string | null;
  variantName?: string | null;
  sku?: string | null;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subtotal: number;
  discount: number;
  couponCode?: string | null;
  tax: number;
  shipping: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: "RAZORPAY" | "COD";
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  orderStatus: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string | null;
  trackingNumber?: string | null;
  estimatedDelivery?: string | null;
  createdAt: string;
  items: OrderItem[];
}

export interface Review {
  id: string;
  userId: string;
  user?: {
    name: string;
    image?: string | null;
  };
  productId: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}
