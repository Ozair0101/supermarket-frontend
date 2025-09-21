import React from 'react';
import { Story, Meta } from '@storybook/react';
import Sidebar from '../components/ui/Sidebar';

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

const Template: Story = (args) => (
  <div className="flex">
    <div className="w-64">
      <Sidebar {...args} />
    </div>
    <div className="flex-1 p-4">
      <h1>Main Content Area</h1>
      <p>This is where the main content would appear.</p>
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {};

export const Collapsed = Template.bind({});
Collapsed.args = {};