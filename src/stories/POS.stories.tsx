import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import POS from '../pages/POS';

export default {
  title: 'Pages/POS',
  component: POS,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof POS>;

type Story = StoryObj<typeof POS>;

export const Default: Story = {
  args: {},
};