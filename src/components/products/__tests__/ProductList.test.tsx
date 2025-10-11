import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductList from '../ProductList';

// Mock the productService
jest.mock('../../services/productService', () => ({
  getProducts: jest.fn(),
}));

describe('ProductList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays product information correctly', async () => {
    const mockProducts = [
      {
        id: 1,
        category_id: 1,
        branch_id: null,
        name: 'Test Product',
        sku: 'TEST-001',
        description: 'A test product',
        reorder_threshold: '10',
        track_expiry: true,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        deleted_at: null,
      },
    ];

    const productService = require('../../services/productService');
    productService.getProducts.mockResolvedValue(mockProducts);

    render(<ProductList />);
    
    // Wait for loading to complete
    expect(await screen.findByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('SKU: TEST-001')).toBeInTheDocument();
    expect(screen.getByText('Reorder Threshold: 10')).toBeInTheDocument();
    expect(screen.getByText('Track Expiry: Yes')).toBeInTheDocument();
  });

  it('displays N/A for missing SKU', async () => {
    const mockProducts = [
      {
        id: 1,
        category_id: 1,
        branch_id: null,
        name: 'Test Product',
        sku: null,
        description: 'A test product',
        reorder_threshold: '10',
        track_expiry: false,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        deleted_at: null,
      },
    ];

    const productService = require('../../services/productService');
    productService.getProducts.mockResolvedValue(mockProducts);

    render(<ProductList />);
    
    // Wait for loading to complete
    expect(await screen.findByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('SKU: N/A')).toBeInTheDocument();
    expect(screen.getByText('Track Expiry: No')).toBeInTheDocument();
  });
});