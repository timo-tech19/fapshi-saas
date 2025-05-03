import { directPaySchema, initiatePaySchema, searchParamsSchema, transactionIdSchema, userIdSchema } from './schemas';
import {
  BalanceData,
  DirectPayParams,
  DirectPayResponse,
  FapshiResponse,
  InitiatePayParams,
  InitiatePayResponse,
  SearchParams,
  TransactionData,
} from './types';
import { baseUrl, handleError, handleFetchResponse, headers } from './utils';

// Fapshi API client
export const fapshiClient = {
  /**
   * Initiates a payment and returns a URL where the user can complete the payment
   * @param params Payment parameters
   */
  async initiatePay(params: InitiatePayParams): Promise<FapshiResponse<InitiatePayResponse>> {
    try {
      // Validate input
      const validatedData = initiatePaySchema.parse(params);

      const response = await fetch(`${baseUrl}/initiate-pay`, {
        method: 'POST',
        headers,
        body: JSON.stringify(validatedData),
      });

      return handleFetchResponse<InitiatePayResponse>(response);
    } catch (error) {
      return handleError<InitiatePayResponse>(error);
    }
  },

  /**
   * Directly initiates a payment request to a user's mobile device
   * @param params Payment parameters including phone number
   */
  async directPay(params: DirectPayParams): Promise<FapshiResponse<DirectPayResponse>> {
    try {
      // Validate input
      const validatedData = directPaySchema.parse(params);

      const response = await fetch(`${baseUrl}/direct-pay`, {
        method: 'POST',
        headers,
        body: JSON.stringify(validatedData),
      });

      return handleFetchResponse<DirectPayResponse>(response);
    } catch (error) {
      return handleError<DirectPayResponse>(error);
    }
  },

  /**
   * Gets the status of a transaction
   * @param transactionId The transaction ID
   */
  async paymentStatus(transactionId: string): Promise<FapshiResponse<TransactionData>> {
    try {
      // Validate input
      const validatedId = transactionIdSchema.parse(transactionId);

      const response = await fetch(`${baseUrl}/payment-status/${validatedId}`, {
        method: 'GET',
        headers,
      });

      return handleFetchResponse<TransactionData>(response);
    } catch (error) {
      return handleError<TransactionData>(error);
    }
  },

  /**
   * Expires a transaction
   * @param transactionId The transaction ID to expire
   */
  async expirePay(transactionId: string): Promise<FapshiResponse<TransactionData>> {
    try {
      // Validate input
      const validatedId = transactionIdSchema.parse(transactionId);

      const response = await fetch(`${baseUrl}/expire-pay`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ transId: validatedId }),
      });

      return handleFetchResponse<TransactionData>(response);
    } catch (error) {
      return handleError<TransactionData>(error);
    }
  },

  /**
   * Gets transactions for a specific user
   * @param userId The user ID
   */
  async userTransactions(userId: string): Promise<FapshiResponse<TransactionData[]>> {
    try {
      // Validate input
      const validatedId = userIdSchema.parse(userId);

      const response = await fetch(`${baseUrl}/transaction/${validatedId}`, {
        method: 'GET',
        headers,
      });

      return handleFetchResponse<TransactionData[]>(response);
    } catch (error) {
      return handleError<TransactionData[]>(error);
    }
  },

  /**
   * Gets the current balance
   */
  async balance(): Promise<FapshiResponse<BalanceData>> {
    try {
      const response = await fetch(`${baseUrl}/balance`, {
        method: 'GET',
        headers,
      });

      return handleFetchResponse<BalanceData>(response);
    } catch (error) {
      return handleError<BalanceData>(error);
    }
  },

  /**
   * Performs a payout to a phone number
   * @param params Payout parameters
   */
  async payout(params: DirectPayParams): Promise<FapshiResponse<TransactionData>> {
    try {
      // Validate input
      const validatedData = directPaySchema.parse(params);

      const response = await fetch(`${baseUrl}/payout`, {
        method: 'POST',
        headers,
        body: JSON.stringify(validatedData),
      });

      return handleFetchResponse<TransactionData>(response);
    } catch (error) {
      return handleError<TransactionData>(error);
    }
  },

  /**
   * Searches for transactions based on criteria
   * @param params Search parameters
   */
  async search(params: SearchParams = {}): Promise<FapshiResponse<TransactionData[]>> {
    try {
      // Validate input
      const validatedParams = searchParamsSchema.parse(params);

      // Build URL with query parameters
      const url = new URL(`${baseUrl}/search`);
      Object.entries(validatedParams).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
      });

      return handleFetchResponse<TransactionData[]>(response);
    } catch (error) {
      return handleError<TransactionData[]>(error);
    }
  },
};
