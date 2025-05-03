import { z } from 'zod';

// Zod schemas for validation
export const initiatePaySchema = z.object({
  amount: z.number().int().min(100, 'Amount cannot be less than 100 FCFA'),
  email: z.string().email().optional(),
  userId: z.string().optional(),
  externalId: z.string().optional(),
  redirectUrl: z.string().url().optional(),
  message: z.string().optional(),
});

export const directPaySchema = z.object({
  amount: z.number().int().min(100, 'Amount cannot be less than 100 FCFA'),
  phone: z.string().regex(/^6[\d]{8}$/, 'Invalid phone number format'),
  medium: z.enum(['mobile money', 'orange money']).optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  userId: z.string().optional(),
  externalId: z.string().optional(),
  message: z.string().optional(),
});

export const transactionIdSchema = z.string().regex(/^[a-zA-Z0-9]{8,10}$/, 'Invalid transaction ID format');

export const userIdSchema = z.string().regex(/^[a-zA-Z0-9-_]{1,100}$/, 'Invalid user ID format');

export const searchParamsSchema = z.object({
  status: z.enum(['created', 'successful', 'failed', 'expired']).optional(),
  medium: z.string().optional(),
  start: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in format yyyy-mm-dd')
    .optional(),
  end: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in format yyyy-mm-dd')
    .optional(),
  amt: z.number().min(100).optional(),
  limit: z.number().min(1).max(100).optional(),
  sort: z.enum(['asc', 'desc']).optional(),
});
