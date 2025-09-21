import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Table from '../components/ui/Table';
import type { ColumnDef } from '@tanstack/react-table';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Product Name',
    cell: info => info.getValue() as string,
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: info => info.getValue() as string,
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: info => `$${(info.getValue() as number).toFixed(2)}`,
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: info => {
      const stock = info.getValue() as number;
      return (
        <span className={stock < 10 ? 'text-red-600 font-bold' : 'text-green-600'}>
          {stock} {stock === 1 ? 'item' : 'items'}
        </span>
      );
    },
  },
];

const data: Product[] = [
  { id: 1, name: 'Organic Apples', category: 'Fruits', price: 2.99, stock: 50 },
  { id: 2, name: 'Whole Milk', category: 'Dairy', price: 3.49, stock: 5 },
  { id: 3, name: 'Whole Wheat Bread', category: 'Bakery', price: 2.79, stock: 12 },
  { id: 4, name: 'Free Range Eggs', category: 'Dairy', price: 4.99, stock: 0 },
  { id: 5, name: 'Organic Bananas', category: 'Fruits', price: 1.99, stock: 25 },
  { id: 6, name: 'Greek Yogurt', category: 'Dairy', price: 3.99, stock: 8 },
  { id: 7, name: 'Fresh Spinach', category: 'Vegetables', price: 2.49, stock: 15 },
  { id: 8, name: 'Chicken Breast', category: 'Meat', price: 8.99, stock: 20 },
];

export default {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Table<Product, unknown>>;

type Story = StoryObj<typeof Table<Product, unknown>>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <Table columns={columns} data={data} />
    </div>
  ),
};

export const WithPagination: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <Table columns={columns} data={[...data, ...data, ...data]} pagination={true} />
    </div>
  ),
};