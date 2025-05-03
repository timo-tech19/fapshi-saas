import { z } from 'zod';
import { directPaySchema, initiatePaySchema, searchParamsSchema } from './schemas';

// Types
export type InitiatePayParams = z.infer<typeof initiatePaySchema>;
export type DirectPayParams = z.infer<typeof directPaySchema>;
export type SearchParams = z.infer<typeof searchParamsSchema>;

export interface FapshiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export interface BalanceData {
  service: string;
  balance: number;
  currency: string;
}

export interface TransactionData {
  transId: string;
  status: 'CREATED' | 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'EXPIRED';
  medium: string;
  serviceName: string;
  amount: number;
  revenue: number;
  payerName: string;
  email: string;
  redirectUrl: string;
  externalId: string;
  userId: string;
  webhook: string;
  financialTransId: string;
  dateInitiated: string;
  dateConfirmed: string;
}

export interface InitiatePayResponse {
  message: string;
  link: string;
  transId: string;
  dateInitiated: Date;
}

export interface DirectPayResponse {
  message: string;
  transId: string;
  dateInitiated: Date;
}
