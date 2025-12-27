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

// Dark mode decorator with cleanup
const withDarkMode = (story: () => string | Node) => {
  document.documentElement.setAttribute('data-color-mode', 'dark');

  // Cleanup when story unmounts
  const container = story();
  if (container instanceof HTMLElement) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node === container || (node as Element).contains?.(container)) {
            document.documentElement.removeAttribute('data-color-mode');
            observer.disconnect();
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  return container;
};

export const DarkMode: Story = {
  args: {
    mergeType: 'merge',
  },
  decorators: [withDarkMode],
};

export const DarkModeSquash: Story = {
  args: {
    mergeType: 'squash',
  },
  decorators: [withDarkMode],
};

export const DarkModeRebase: Story = {
  args: {
    mergeType: 'rebase',
  },
  decorators: [withDarkMode],
};
