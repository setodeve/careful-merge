import { createConfirmDialog, detectMergeType } from '../components/ConfirmDialog';
import '../assets/styles.css';

export default defineContentScript({
  matches: ['*://github.com/*/pull/*'],

  main() {
    function interceptMergeButton(button: HTMLButtonElement) {
      if (button.dataset.carefulMergeIntercepted) {
        return;
      }
      button.dataset.carefulMergeIntercepted = 'true';

      button.addEventListener(
        'click',
        (e) => {
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
        },
        true
      );
    }

    function isConfirmMergeButton(button: Element): boolean {
      const text = button.textContent?.trim() || '';
      return /^Confirm\s+(merge|squash|rebase)/i.test(text);
    }

    function findAndInterceptMergeButtons() {
      // Method 1: data-variant="primary" buttons with Confirm text (latest UI)
      document.querySelectorAll<HTMLButtonElement>('button[data-variant="primary"]').forEach((button) => {
        if (button.disabled) return;
        if (isConfirmMergeButton(button)) {
          interceptMergeButton(button);
        }
      });

      // Method 2: Fallback selectors for older GitHub UI
      const fallbackSelectors = [
        'button[data-octo-click="merge_pull_request"]',
        '.js-merge-commit-button',
        '.js-merge-box button[type="submit"]',
      ];

      fallbackSelectors.forEach((selector) => {
        document.querySelectorAll<HTMLButtonElement>(selector).forEach((button) => {
          if (button.disabled) return;
          interceptMergeButton(button);
        });
      });
    }

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
        subtree: true,
      });
    }

    // Initialize
    findAndInterceptMergeButtons();
    observeDOM();
  },
});
