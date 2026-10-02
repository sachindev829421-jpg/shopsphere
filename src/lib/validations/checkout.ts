import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  brand: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be greater than zero"),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  discount: z.coerce.number().min(0).max(100).default(0),
  stockQuantity: z.coerce.number().int().min(0, "Stock cannot be negative"),
  lowStockThreshold: z.coerce.number().int().min(0).default(5),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  specifications: z.record(z.string(), z.string()).default({}),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  images: z.array(z.string().url("Must be valid URL")).min(1, "At least one image is required"),
  variants: z
    .array(
      z.object({
        sku: z.string().min(1),
        name: z.string().min(1),
        size: z.string().optional().nullable(),
        color: z.string().optional().nullable(),
        price: z.coerce.number().positive().optional().nullable(),
        stockQuantity: z.coerce.number().int().min(0),
      })
    )
    .default([]),
});

export const addressSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid 10-digit phone number is required"),
  street: z.string().min(5, "Street address is required"),
  apartment: z.string().optional().nullable(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(6, "Valid 6-digit PIN code is required"),
  country: z.string().default("India"),
  isDefault: z.boolean().default(false),
  type: z.enum(["SHIPPING", "BILLING", "BOTH"]).default("SHIPPING"),
});

export const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      variantId: z.string().optional().nullable(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "Cart cannot be empty"),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  couponCode: z.string().optional().nullable(),
  paymentMethod: z.enum(["RAZORPAY", "COD"]),
  notes: z.string().optional().nullable(),
});
