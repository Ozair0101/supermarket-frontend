import api from './api';

export interface Payment {
  id?: number;
  payable_type: string; // 'App\\Models\\Sale' or 'App\\Models\\Purchase'
  payable_id: number;
  amount: number;
  method: 'cash' | 'card' | 'bank_transfer';
  reference?: string;
  paid_at: string;
  notes?: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentFormData {
  payable_type: string;
  payable_id: number;
  amount: number;
  method: 'cash' | 'card' | 'bank_transfer';
  reference?: string;
  paid_at: string;
  notes?: string;
  user_id?: number;
}

// Get all payments
export const getPayments = async (): Promise<Payment[]> => {
  try {
    const response = await api.get<Payment[]>('/payments');
    // Ensure amounts are proper numbers
    return response.data.map(payment => ({
      ...payment,
      amount: typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount
    }));
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

// Get payment by ID
export const getPayment = async (id: number): Promise<Payment> => {
  try {
    const response = await api.get<Payment>(`/payments/${id}`);
    // Ensure amount is a proper number
    return {
      ...response.data,
      amount: typeof response.data.amount === 'string' ? parseFloat(response.data.amount) : response.data.amount
    };
  } catch (error) {
    console.error(`Error fetching payment with id ${id}:`, error);
    throw error;
  }
};

// Create a new payment
export const createPayment = async (data: PaymentFormData): Promise<Payment> => {
  try {
    // Ensure amount is a proper number
    const formattedData = {
      ...data,
      amount: typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount
    };
    
    const response = await api.post<Payment>('/payments', formattedData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

// Update an existing payment
export const updatePayment = async (id: number, data: Partial<PaymentFormData>): Promise<Payment> => {
  try {
    // Ensure amount is a proper number if provided
    const formattedData = {
      ...data,
      amount: data.amount !== undefined 
        ? (typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount)
        : undefined
    };
    
    const response = await api.put<Payment>(`/payments/${id}`, formattedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating payment with id ${id}:`, error);
    throw error;
  }
};

// Delete a payment
export const deletePayment = async (id: number): Promise<void> => {
  try {
    await api.delete(`/payments/${id}`);
  } catch (error) {
    console.error(`Error deleting payment with id ${id}:`, error);
    throw error;
  }
};

// Get payments for a specific sale
export const getPaymentsForSale = async (saleId: number): Promise<Payment[]> => {
  try {
    const response = await api.get<Payment[]>(`/sales/${saleId}/payments`);
    // Ensure amounts are proper numbers
    return response.data.map(payment => ({
      ...payment,
      amount: typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount
    }));
  } catch (error) {
    console.error(`Error fetching payments for sale ${saleId}:`, error);
    throw error;
  }
};

// Get payments for a specific purchase
export const getPaymentsForPurchase = async (purchaseId: number): Promise<Payment[]> => {
  try {
    const response = await api.get<Payment[]>(`/purchases/${purchaseId}/payments`);
    // Ensure amounts are proper numbers
    return response.data.map(payment => ({
      ...payment,
      amount: typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount
    }));
  } catch (error) {
    console.error(`Error fetching payments for purchase ${purchaseId}:`, error);
    throw error;
  }
};