import type { MergeMethod, MergeTypes } from '../types';

// SVG icons inspired by GitHub's Octicons
const ICONS = {
  // Merge: two branches joining
  merge: `<svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
    <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-.878Zm6.75-.372a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm-3 8.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
  </svg>`,
  // Squash: multiple commits becoming one
  squash: `<svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
    <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm9-3a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM8 9.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm1 2.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
  </svg>`,
  // Rebase: linear commit history
  rebase: `<svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
    <path d="M8.75 1.75V5H12a.75.75 0 0 1 0 1.5H8.75v3H12a.75.75 0 0 1 0 1.5H8.75v3.25a.75.75 0 0 1-1.5 0V11H4a.75.75 0 0 1 0-1.5h3.25v-3H4a.75.75 0 0 1 0-1.5h3.25V1.75a.75.75 0 0 1 1.5 0Z"/>
  </svg>`,
};

export const MERGE_TYPES: MergeTypes = {
  merge: {
    name: 'Merge commit',
    description: 'Preserves all commits and creates a merge commit',
    icon: ICONS.merge,
    color: '#238636',
  },
  squash: {
    name: 'Squash and merge',
    description: 'Combines all commits into one and merges',
    icon: ICONS.squash,
    color: '#8957e5',
  },
  rebase: {
    name: 'Rebase and merge',
    description: 'Rebases commits onto the base branch and merges',
    icon: ICONS.rebase,
    color: '#bf8700',
  },
};

export function createConfirmDialog(
  mergeType: MergeMethod,
  onConfirm: () => void,
  onCancel: () => void
): HTMLDivElement {
  const typeInfo = MERGE_TYPES[mergeType] || MERGE_TYPES.merge;

  const overlay = document.createElement('div');
  overlay.className = 'careful-merge-overlay';

  const dialog = document.createElement('div');
  dialog.className = 'careful-merge-dialog';

  // Accessibility attributes
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'careful-merge-title');
  dialog.setAttribute('aria-describedby', 'careful-merge-description');

  dialog.innerHTML = `
    <div class="careful-merge-header" style="border-left: 4px solid ${typeInfo.color}">
      <span class="careful-merge-icon" style="color: ${typeInfo.color}" aria-hidden="true">${typeInfo.icon}</span>
      <div class="careful-merge-type-info">
        <strong id="careful-merge-title" class="careful-merge-type-name">${typeInfo.name}</strong>
        <p class="careful-merge-type-desc">${typeInfo.description}</p>
      </div>
    </div>
    <div class="careful-merge-content">
      <p id="careful-merge-description" class="careful-merge-question">Proceed with this merge method?</p>
    </div>
    <div class="careful-merge-actions">
      <button class="careful-merge-btn careful-merge-btn-cancel" aria-label="Cancel merge">Cancel</button>
      <button class="careful-merge-btn careful-merge-btn-confirm" style="background-color: ${typeInfo.color}" aria-label="Confirm ${typeInfo.name}">
        Confirm ${typeInfo.name}
      </button>
    </div>
  `;

  overlay.appendChild(dialog);

  const cancelBtn = dialog.querySelector('.careful-merge-btn-cancel') as HTMLButtonElement;
  const confirmBtn = dialog.querySelector('.careful-merge-btn-confirm') as HTMLButtonElement;

  // Cleanup function to remove event listeners
  const cleanup = () => {
    document.removeEventListener('keydown', handleKeydown);
    overlay.remove();
  };

  cancelBtn.addEventListener('click', () => {
    cleanup();
    onCancel();
  });

  confirmBtn.addEventListener('click', () => {
    cleanup();
    onConfirm();
  });

  // Cancel on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      cleanup();
      onCancel();
    }
  });

  // Keyboard event handler (Escape to cancel, Tab for focus trap)
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      cleanup();
      onCancel();
      return;
    }

    // Focus trap: keep focus within dialog
    if (e.key === 'Tab') {
      const focusableElements = [cancelBtn, confirmBtn];
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab: loop from first to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: loop from last to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };
  document.addEventListener('keydown', handleKeydown);

  // Set initial focus to cancel button (safer default)
  requestAnimationFrame(() => {
    cancelBtn.focus();
  });

  return overlay;
}

export function detectMergeType(button: HTMLElement): MergeMethod {
  const buttonText = button.textContent?.toLowerCase() || '';
  const formAction = button.closest('form')?.action || '';

  if (buttonText.includes('squash') || formAction.includes('squash')) {
    return 'squash';
  }
  if (buttonText.includes('rebase') || formAction.includes('rebase')) {
    return 'rebase';
  }
  return 'merge';
}
