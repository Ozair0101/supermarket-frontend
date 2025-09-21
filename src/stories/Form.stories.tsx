import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Form, FormField, FormSelect, FormButton } from '../components/ui/Form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  category: z.string().min(1, 'Please select a category'),
});

type FormValues = z.infer<typeof formSchema>;

export default {
  title: 'Components/Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Form>;

type Story = StoryObj<typeof Form>;

export const Default: Story = {
  render: () => {
    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        email: '',
        category: '',
      },
    });

    const onSubmit = (data: FormValues) => {
      console.log(data);
      alert('Form submitted successfully!');
    };

    return (
      <div className="w-full max-w-md">
        <Form form={form} schema={formSchema} onSubmit={onSubmit} className="space-y-4">
          <FormField
            name="name"
            label="Name"
            placeholder="Enter your name"
            form={form}
          />
          
          <FormField
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            form={form}
          />
          
          <FormSelect
            name="category"
            label="Category"
            options={[
              { value: 'fruits', label: 'Fruits' },
              { value: 'vegetables', label: 'Vegetables' },
              { value: 'dairy', label: 'Dairy' },
              { value: 'bakery', label: 'Bakery' },
            ]}
            form={form}
          />
          
          <div className="flex space-x-3">
            <FormButton type="submit" variant="primary">
              Submit
            </FormButton>
            <FormButton
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
            >
              Reset
            </FormButton>
          </div>
        </Form>
      </div>
    );
  },
};