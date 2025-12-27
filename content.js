// Careful Merge - GitHub PR merge confirmation extension
(function () {
  'use strict';

  // Merge type definitions
  const MERGE_TYPES = {
    merge: {
      name: 'Merge commit',
      description: 'Preserves all commits and creates a merge commit',
      icon: '🔀',
      color: '#238636'
    },
    squash: {
      name: 'Squash and merge',
      description: 'Combines all commits into one and merges',
      icon: '📦',
      color: '#8957e5'
    },
    rebase: {
      name: 'Rebase and merge',
      description: 'Rebases commits onto the base branch and merges',
      icon: '📐',
      color: '#bf8700'
    }
  };

  // Create confirmation dialog
  function createConfirmDialog(mergeType, onConfirm, onCancel) {
    const typeInfo = MERGE_TYPES[mergeType] || MERGE_TYPES.merge;

    const overlay = document.createElement('div');
    overlay.className = 'careful-merge-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'careful-merge-dialog';

    dialog.innerHTML = `
      <div class="careful-merge-header">
        <span class="careful-merge-icon">${typeInfo.icon}</span>
        <h2>Confirm Merge Method</h2>
      </div>
      <div class="careful-merge-content">
        <div class="careful-merge-type" style="border-left: 4px solid ${typeInfo.color}">
          <strong>${typeInfo.name}</strong>
          <p>${typeInfo.description}</p>
        </div>
        <p class="careful-merge-question">Are you sure you want to proceed with this merge method?</p>
      </div>
      <div class="careful-merge-actions">
        <button class="careful-merge-btn careful-merge-btn-cancel">Cancel</button>
        <button class="careful-merge-btn careful-merge-btn-confirm" style="background-color: ${typeInfo.color}">
          Confirm ${typeInfo.name}
        </button>
      </div>
    `;

    overlay.appendChild(dialog);

    // Event listeners
    const cancelBtn = dialog.querySelector('.careful-merge-btn-cancel');
    const confirmBtn = dialog.querySelector('.careful-merge-btn-confirm');

    cancelBtn.addEventListener('click', () => {
      overlay.remove();
      onCancel();
    });

    confirmBtn.addEventListener('click', () => {
      overlay.remove();
      onConfirm();
    });

    // Cancel on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
        onCancel();
      }
    });

    // Cancel on Escape key
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        overlay.remove();
        onCancel();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);

    return overlay;
  }

  // Detect merge type from button
  function detectMergeType(button) {
    const buttonText = button.textContent.toLowerCase();
    const formAction = button.closest('form')?.action || '';

    if (buttonText.includes('squash') || formAction.includes('squash')) {
      return 'squash';
    }
    if (buttonText.includes('rebase') || formAction.includes('rebase')) {
      return 'rebase';
    }
    return 'merge';
  }

  // Add interceptor to merge button
  function interceptMergeButton(button) {
    if (button.dataset.carefulMergeIntercepted) {
      return;
    }
    button.dataset.carefulMergeIntercepted = 'true';

    button.addEventListener('click', (e) => {
      // Skip if already confirmed
      if (button.dataset.carefulMergeConfirmed === 'true') {
        button.dataset.carefulMergeConfirmed = 'false';
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const mergeType = detectMergeType(button);

      const dialog = createConfirmDialog(
        mergeType,
        // On confirm
        () => {
          button.dataset.carefulMergeConfirmed = 'true';
          button.click();
        },
        // On cancel
        () => {
          // Do nothing
        }
      );

      document.body.appendChild(dialog);
    }, true);
  }

  // Check if current page is a pull request page
  function isPullRequestPage() {
    return /\/pull\/\d+/.test(window.location.pathname);
  }

  // Check if button is a confirm merge button (text-based)
  function isConfirmMergeButton(button) {
    const text = button.textContent.trim();
    // "Confirm merge", "Confirm squash and merge", "Confirm rebase and merge"
    return /^Confirm\s+(merge|squash|rebase)/i.test(text);
  }

  // Find and intercept merge buttons
  function findAndInterceptMergeButtons() {
    // Only run on pull request pages
    if (!isPullRequestPage()) {
      return;
    }

    // Method 1: data-variant="primary" buttons with Confirm text (latest UI)
    document.querySelectorAll('button[data-variant="primary"]').forEach((button) => {
      if (button.disabled) return;
      if (isConfirmMergeButton(button)) {
        interceptMergeButton(button);
      }
    });

    // Method 2: Fallback selectors for older GitHub UI
    const fallbackSelectors = [
      'button[data-octo-click="merge_pull_request"]',
      '.js-merge-commit-button',
      '.js-merge-box button[type="submit"]'
    ];

    fallbackSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((button) => {
        if (button.disabled) return;
        interceptMergeButton(button);
      });
    });
  }

  // Observe DOM changes with MutationObserver
  function observeDOM() {
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          shouldCheck = true;
          break;
        }
      }
      if (shouldCheck) {
        findAndInterceptMergeButtons();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Initialize
  function init() {
    findAndInterceptMergeButtons();
    observeDOM();
  }

  // Run after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
