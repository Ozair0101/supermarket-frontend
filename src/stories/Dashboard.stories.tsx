import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Dashboard from '../pages/Dashboard';

export default {
  title: 'Pages/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof Dashboard>;

type Story = StoryObj<typeof Dashboard>;

export const Default: Story = {
  args: {},
};