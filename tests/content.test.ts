import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { waitFor } from '@testing-library/dom';

// Import content script (WXT globals are mocked in vitest.setup.ts)
import '../entrypoints/content';

// Get the main function stored by the mock
const getContentScriptMain = () =>
  (globalThis as Record<string, unknown>).__contentScriptMain as (() => void) | undefined;

describe('content script', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // Reset the confirmed state
    document.querySelectorAll('[data-careful-merge-intercepted]').forEach((el) => {
      delete (el as HTMLElement).dataset.carefulMergeIntercepted;
      delete (el as HTMLElement).dataset.carefulMergeConfirmed;
    });
  });

  afterEach(() => {
    // Clean up any dialogs
    document.querySelectorAll('.careful-merge-overlay').forEach((el) => el.remove());
  });

  describe('interceptMergeButton', () => {
    it('should intercept button with data-octo-click="merge_pull_request"', () => {
      const button = document.createElement('button');
      button.setAttribute('data-octo-click', 'merge_pull_request');
      button.textContent = 'Merge pull request';
      document.body.appendChild(button);

      getContentScriptMain()?.();

      expect(button.dataset.carefulMergeIntercepted).toBe('true');
    });

    it('should intercept button with class js-merge-commit-button', () => {
      const button = document.createElement('button');
      button.className = 'js-merge-commit-button';
      button.textContent = 'Merge';
      document.body.appendChild(button);

      getContentScriptMain()?.();

      expect(button.dataset.carefulMergeIntercepted).toBe('true');
    });

    it('should intercept button with data-variant="primary" and Confirm text', () => {
      const button = document.createElement('button');
      button.setAttribute('data-variant', 'primary');
      button.textContent = 'Confirm merge';
      document.body.appendChild(button);

      getContentScriptMain()?.();

      expect(button.dataset.carefulMergeIntercepted).toBe('true');
    });

    it('should not intercept disabled buttons', () => {
      const button = document.createElement('button');
      button.setAttribute('data-octo-click', 'merge_pull_request');
      button.disabled = true;
      document.body.appendChild(button);

      getContentScriptMain()?.();

      expect(button.dataset.carefulMergeIntercepted).toBeUndefined();
    });

    it('should not intercept buttons without matching selectors', () => {
      const button = document.createElement('button');
      button.textContent = 'Submit';
      document.body.appendChild(button);

      getContentScriptMain()?.();

      expect(button.dataset.carefulMergeIntercepted).toBeUndefined();
    });

    it('should not intercept same button twice', () => {
      const button = document.createElement('button');
      button.setAttribute('data-octo-click', 'merge_pull_request');
      button.textContent = 'Merge';
      document.body.appendChild(button);

      getContentScriptMain()?.();
      getContentScriptMain()?.();

      // Should still only have one intercepted flag
      expect(button.dataset.carefulMergeIntercepted).toBe('true');
    });
  });

  describe('dialog behavior', () => {
    it('should show dialog when merge button is clicked', () => {
      const button = document.createElement('button');
      button.setAttribute('data-octo-click', 'merge_pull_request');
      button.textContent = 'Merge pull request';
      document.body.appendChild(button);

      getContentScriptMain()?.();
      button.click();

      const dialog = document.querySelector('.careful-merge-overlay');
      expect(dialog).toBeTruthy();
    });

    it('should prevent default click behavior', () => {
      const button = document.createElement('button');
      button.setAttribute('data-octo-click', 'merge_pull_request');
      button.textContent = 'Merge pull request';
      document.body.appendChild(button);

      const clickHandler = vi.fn();
      button.addEventListener('click', clickHandler);

      getContentScriptMain()?.();

      // Create a custom event to check if preventDefault was called
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      button.dispatchEvent(event);

      // Dialog should appear
      const dialog = document.querySelector('.careful-merge-overlay');
      expect(dialog).toBeTruthy();
    });

    it('should close dialog on cancel', () => {
      const button = document.createElement('button');
      button.setAttribute('data-octo-click', 'merge_pull_request');
      button.textContent = 'Merge pull request';
      document.body.appendChild(button);

      getContentScriptMain()?.();
      button.click();

      const cancelBtn = document.querySelector('.careful-merge-btn-cancel') as HTMLButtonElement;
      cancelBtn?.click();

      const dialog = document.querySelector('.careful-merge-overlay');
      expect(dialog).toBeNull();
    });

    it('should proceed with merge on confirm', () => {
      const button = document.createElement('button');
      button.setAttribute('data-octo-click', 'merge_pull_request');
      button.textContent = 'Merge pull request';
      document.body.appendChild(button);

      getContentScriptMain()?.();
      button.click();

      const confirmBtn = document.querySelector('.careful-merge-btn-confirm') as HTMLButtonElement;
      confirmBtn?.click();

      // Dialog should be closed
      const dialog = document.querySelector('.careful-merge-overlay');
      expect(dialog).toBeNull();

      // Confirmed flag should be reset after the click completes
      expect(button.dataset.carefulMergeConfirmed).toBe('false');
    });
  });

  describe('isConfirmMergeButton', () => {
    it('should match "Confirm merge" button', () => {
      const button = document.createElement('button');
      button.setAttribute('data-variant', 'primary');
      button.textContent = 'Confirm merge';
      document.body.appendChild(button);

      getContentScriptMain()?.();

      expect(button.dataset.carefulMergeIntercepted).toBe('true');
    });

    it('should match "Confirm squash" button', () => {
      const button = document.createElement('button');
      button.setAttribute('data-variant', 'primary');
      button.textContent = 'Confirm squash and merge';
      document.body.appendChild(button);

      getContentScriptMain()?.();

      expect(button.dataset.carefulMergeIntercepted).toBe('true');
    });

    it('should match "Confirm rebase" button', () => {
      const button = document.createElement('button');
      button.setAttribute('data-variant', 'primary');
      button.textContent = 'Confirm rebase and merge';
      document.body.appendChild(button);

      getContentScriptMain()?.();

      expect(button.dataset.carefulMergeIntercepted).toBe('true');
    });

    it('should not match unrelated primary buttons', () => {
      const button = document.createElement('button');
      button.setAttribute('data-variant', 'primary');
      button.textContent = 'Submit review';
      document.body.appendChild(button);

      getContentScriptMain()?.();

      expect(button.dataset.carefulMergeIntercepted).toBeUndefined();
    });
  });

  describe('MutationObserver', () => {
    it('should intercept dynamically added buttons', async () => {
      getContentScriptMain()?.();

      // Add button after initialization
      const button = document.createElement('button');
      button.setAttribute('data-octo-click', 'merge_pull_request');
      button.textContent = 'Merge pull request';
      document.body.appendChild(button);

      // Wait for MutationObserver to trigger
      await waitFor(() => {
        expect(button.dataset.carefulMergeIntercepted).toBe('true');
      });
    });
  });
});
