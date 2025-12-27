import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/dom';
import { MERGE_TYPES, createConfirmDialog, detectMergeType } from '../components/ConfirmDialog';

describe('MERGE_TYPES', () => {
  it('should have all three merge types defined', () => {
    expect(MERGE_TYPES).toHaveProperty('merge');
    expect(MERGE_TYPES).toHaveProperty('squash');
    expect(MERGE_TYPES).toHaveProperty('rebase');
  });

  it('should have correct properties for each merge type', () => {
    for (const type of Object.values(MERGE_TYPES)) {
      expect(type).toHaveProperty('name');
      expect(type).toHaveProperty('description');
      expect(type).toHaveProperty('icon');
      expect(type).toHaveProperty('color');
    }
  });
});

describe('detectMergeType', () => {
  it('should detect squash merge from button text', () => {
    const button = document.createElement('button');
    button.textContent = 'Squash and merge';
    expect(detectMergeType(button)).toBe('squash');
  });

  it('should detect rebase merge from button text', () => {
    const button = document.createElement('button');
    button.textContent = 'Rebase and merge';
    expect(detectMergeType(button)).toBe('rebase');
  });

  it('should detect regular merge from button text', () => {
    const button = document.createElement('button');
    button.textContent = 'Merge pull request';
    expect(detectMergeType(button)).toBe('merge');
  });

  it('should detect squash from form action', () => {
    const form = document.createElement('form');
    form.action = '/repo/pull/1/squash';
    const button = document.createElement('button');
    form.appendChild(button);
    expect(detectMergeType(button)).toBe('squash');
  });

  it('should detect rebase from form action', () => {
    const form = document.createElement('form');
    form.action = '/repo/pull/1/rebase';
    const button = document.createElement('button');
    form.appendChild(button);
    expect(detectMergeType(button)).toBe('rebase');
  });

  it('should default to merge when no specific type is detected', () => {
    const button = document.createElement('button');
    button.textContent = 'Submit';
    expect(detectMergeType(button)).toBe('merge');
  });
});

describe('createConfirmDialog', () => {
  let onConfirm: () => void;
  let onCancel: () => void;

  beforeEach(() => {
    onConfirm = vi.fn();
    onCancel = vi.fn();
    document.body.innerHTML = '';
  });

  it('should create an overlay element', () => {
    const overlay = createConfirmDialog('merge', onConfirm, onCancel);
    expect(overlay.className).toBe('careful-merge-overlay');
  });

  it('should create dialog with correct accessibility attributes', () => {
    const overlay = createConfirmDialog('merge', onConfirm, onCancel);
    const dialog = overlay.querySelector('.careful-merge-dialog');

    expect(dialog?.getAttribute('role')).toBe('dialog');
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
    expect(dialog?.getAttribute('aria-labelledby')).toBe('careful-merge-title');
    expect(dialog?.getAttribute('aria-describedby')).toBe('careful-merge-description');
  });

  it('should display correct merge type info', () => {
    const overlay = createConfirmDialog('squash', onConfirm, onCancel);
    document.body.appendChild(overlay);

    expect(screen.getByText('Squash and merge')).toBeTruthy();
    expect(screen.getByText('Combines all commits into one and merges')).toBeTruthy();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    const overlay = createConfirmDialog('merge', onConfirm, onCancel);
    document.body.appendChild(overlay);

    const confirmBtn = overlay.querySelector('.careful-merge-btn-confirm') as HTMLButtonElement;
    confirmBtn.click();

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', () => {
    const overlay = createConfirmDialog('merge', onConfirm, onCancel);
    document.body.appendChild(overlay);

    const cancelBtn = overlay.querySelector('.careful-merge-btn-cancel') as HTMLButtonElement;
    cancelBtn.click();

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('should call onCancel when overlay is clicked', () => {
    const overlay = createConfirmDialog('merge', onConfirm, onCancel);
    document.body.appendChild(overlay);

    overlay.click();

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('should call onCancel when Escape key is pressed', () => {
    const overlay = createConfirmDialog('merge', onConfirm, onCancel);
    document.body.appendChild(overlay);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('should remove overlay after confirm', () => {
    const overlay = createConfirmDialog('merge', onConfirm, onCancel);
    document.body.appendChild(overlay);

    const confirmBtn = overlay.querySelector('.careful-merge-btn-confirm') as HTMLButtonElement;
    confirmBtn.click();

    expect(document.body.contains(overlay)).toBe(false);
  });

  it('should have confirm button with correct merge type name', () => {
    const overlay = createConfirmDialog('rebase', onConfirm, onCancel);
    document.body.appendChild(overlay);

    const confirmBtn = overlay.querySelector('.careful-merge-btn-confirm') as HTMLButtonElement;
    expect(confirmBtn.textContent?.trim()).toBe('Confirm Rebase and merge');
  });

  it('should fallback to merge type for invalid mergeType', () => {
    // @ts-expect-error Testing invalid input
    const overlay = createConfirmDialog('invalid', onConfirm, onCancel);
    document.body.appendChild(overlay);

    // Should fallback to merge type
    expect(screen.getByText('Merge commit')).toBeTruthy();
    expect(screen.getByText('Preserves all commits and creates a merge commit')).toBeTruthy();
  });

  describe('focus trap', () => {
    it('should trap focus from last to first element on Tab', () => {
      const overlay = createConfirmDialog('merge', onConfirm, onCancel);
      document.body.appendChild(overlay);

      const confirmBtn = overlay.querySelector('.careful-merge-btn-confirm') as HTMLButtonElement;
      const cancelBtn = overlay.querySelector('.careful-merge-btn-cancel') as HTMLButtonElement;

      confirmBtn.focus();
      expect(document.activeElement).toBe(confirmBtn);

      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      document.dispatchEvent(tabEvent);

      expect(document.activeElement).toBe(cancelBtn);
    });

    it('should trap focus from first to last element on Shift+Tab', () => {
      const overlay = createConfirmDialog('merge', onConfirm, onCancel);
      document.body.appendChild(overlay);

      const confirmBtn = overlay.querySelector('.careful-merge-btn-confirm') as HTMLButtonElement;
      const cancelBtn = overlay.querySelector('.careful-merge-btn-cancel') as HTMLButtonElement;

      cancelBtn.focus();
      expect(document.activeElement).toBe(cancelBtn);

      const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true });
      document.dispatchEvent(shiftTabEvent);

      expect(document.activeElement).toBe(confirmBtn);
    });
  });

  describe('cleanup', () => {
    it('should remove keydown event listener after confirm', () => {
      const overlay = createConfirmDialog('merge', onConfirm, onCancel);
      document.body.appendChild(overlay);

      const confirmBtn = overlay.querySelector('.careful-merge-btn-confirm') as HTMLButtonElement;
      confirmBtn.click();

      // After cleanup, Escape should not trigger onCancel again
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(onCancel).not.toHaveBeenCalled();
    });

    it('should remove keydown event listener after cancel', () => {
      const overlay = createConfirmDialog('merge', onConfirm, onCancel);
      document.body.appendChild(overlay);

      const cancelBtn = overlay.querySelector('.careful-merge-btn-cancel') as HTMLButtonElement;
      cancelBtn.click();

      // Reset mock to check if Escape triggers it again
      vi.mocked(onCancel).mockClear();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(onCancel).not.toHaveBeenCalled();
    });

    it('should remove keydown event listener after overlay click', () => {
      const overlay = createConfirmDialog('merge', onConfirm, onCancel);
      document.body.appendChild(overlay);

      overlay.click();

      vi.mocked(onCancel).mockClear();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(onCancel).not.toHaveBeenCalled();
    });

    it('should remove keydown event listener after Escape', () => {
      const overlay = createConfirmDialog('merge', onConfirm, onCancel);
      document.body.appendChild(overlay);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      vi.mocked(onCancel).mockClear();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(onCancel).not.toHaveBeenCalled();
    });
  });
});
