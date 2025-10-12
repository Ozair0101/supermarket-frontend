import api from './api';

export interface DashboardStats {
  total_products: number;
  sales_today: number;
  sales_count_today: number;
  total_customers: number;
  total_revenue: number;
}

export interface InventoryStatus {
  low_stock_products: any[];
  out_of_stock_products: any[];
}

export interface RecentSale {
  id: number;
  invoice_number?: string;
  customer?: {
    id: number;
    name: string;
  };
  sale_date: string;
  total: number;
  status: string;
  items: {
    id: number;
    product_id: number;
    product?: {
      id: number;
      name: string;
    };
    quantity: number;
    unit_price: number;
    line_total: number;
  }[];
}

export interface DashboardData {
  stats: DashboardStats;
  inventory_status: InventoryStatus;
  recent_sales: RecentSale[];
}

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await api.get<DashboardData>('/reports/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};