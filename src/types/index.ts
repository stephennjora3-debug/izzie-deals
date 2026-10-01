export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  salePrice?: number;
  currency: string;
  category: string;
  brand: string;
  images: string[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  price?: number;
  stockQuantity: number;
  attributes: Record<string, string>;
  imageUrl?: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  parentId?: string;
  name: string;
  slug: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
  children?: Category[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  attributes: Record<string, string>;
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  role: 'customer' | 'admin';
}

export interface Order {
  id: string;
  userId: string;
  status: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  items: OrderItem[];
  shippingAddress: Address;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productName: string;
  variantAttributes: Record<string, string>;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  country: string;
  isDefault: boolean;
}
