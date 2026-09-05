import { z } from 'zod';

export const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.enum(['apartment', 'house', 'room', 'pg', 'office', 'plot']),
  price: z.number().min(1000, 'Price must be at least ₹1,000'),
  deposit: z.number().optional(),
  address: z.string().min(5, 'Address is required'),
  area: z.string().min(2, 'Area is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().default('Maharashtra'),
  pincode: z.string().optional(),
  bedrooms: z.number().min(0).max(10),
  bathrooms: z.number().min(1).max(10),
  furnishing: z.enum(['unfurnished', 'semi', 'fully']),
  amenities: z.array(z.string()).optional(),
  rules: z.string().optional(),
});

export const searchSchema = z.object({
  query: z.string().optional(),
  city: z.string().optional(),
  area: z.string().optional(),
  type: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  bedrooms: z.number().optional(),
  furnishing: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(12),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Valid phone number required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'owner']).default('user'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export type PropertyInput = z.infer<typeof propertySchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
