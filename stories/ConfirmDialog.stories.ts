import type { Meta, StoryObj } from '@storybook/html-vite';
import { createConfirmDialog } from '../components/ConfirmDialog';
import type { MergeMethod } from '../types';

const meta: Meta = {
  title: 'Components/ConfirmDialog',
  argTypes: {
    mergeType: {
      control: { type: 'select' },
      options: ['merge', 'squash', 'rebase'],
    },
  },
  render: (args) => {
    const container = document.createElement('div');
    container.style.minHeight = '400px';
    container.style.position = 'relative';

    const dialog = createConfirmDialog(
      args.mergeType as MergeMethod,
      () => console.log('Confirmed!'),
      () => console.log('Cancelled!')
    );

    // Make dialog visible within container for Storybook
    dialog.style.position = 'absolute';
    container.appendChild(dialog);

    return container;
  },
};

export default meta;

type Story = StoryObj;

export const MergeCommit: Story = {
  args: {
    mergeType: 'merge',
  },
};

export const SquashAndMerge: Story = {
  args: {
    mergeType: 'squash',
  },
};

export const RebaseAndMerge: Story = {
  args: {
    mergeType: 'rebase',
  },
};

export const DarkMode: Story = {
  args: {
    mergeType: 'merge',
  },
  decorators: [
    (story) => {
      document.documentElement.setAttribute('data-color-mode', 'dark');
      return story();
    },
  ],
};

export const DarkModeSquash: Story = {
  args: {
    mergeType: 'squash',
  },
  decorators: [
    (story) => {
      document.documentElement.setAttribute('data-color-mode', 'dark');
      return story();
    },
  ],
};

export const DarkModeRebase: Story = {
  args: {
    mergeType: 'rebase',
  },
  decorators: [
    (story) => {
      document.documentElement.setAttribute('data-color-mode', 'dark');
      return story();
    },
  ],
};
