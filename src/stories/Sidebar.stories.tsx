import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Sidebar from '../components/ui/Sidebar';

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof Sidebar>;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div className="flex">
      <div className="w-64">
        <Sidebar {...args} />
      </div>
      <div className="flex-1 p-4">
        <h1>Main Content Area</h1>
        <p>This is where the main content would appear.</p>
      </div>
    </div>
  ),
};

export const Collapsed: Story = {
  args: {},
  render: (args) => (
    <div className="flex">
      <div className="w-20">
        <Sidebar {...args} />
      </div>
      <div className="flex-1 p-4">
        <h1>Main Content Area</h1>
        <p>This is where the main content would appear.</p>
      </div>
    </div>
  ),
};