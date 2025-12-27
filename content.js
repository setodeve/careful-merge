// Careful Merge - GitHub PR マージ確認拡張機能
(function () {
  'use strict';

  // マージタイプの定義
  const MERGE_TYPES = {
    merge: {
      name: 'Merge commit',
      description: 'すべてのコミットを保持してマージコミットを作成します',
      icon: '🔀',
      color: '#238636'
    },
    squash: {
      name: 'Squash and merge',
      description: 'すべてのコミットを1つにまとめてマージします',
      icon: '📦',
      color: '#8957e5'
    },
    rebase: {
      name: 'Rebase and merge',
      description: 'コミットをベースブランチにリベースしてマージします',
      icon: '📐',
      color: '#bf8700'
    }
  };

  // 確認ダイアログを作成
  function createConfirmDialog(mergeType, onConfirm, onCancel) {
    const typeInfo = MERGE_TYPES[mergeType] || MERGE_TYPES.merge;

    const overlay = document.createElement('div');
    overlay.className = 'careful-merge-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'careful-merge-dialog';

    dialog.innerHTML = `
      <div class="careful-merge-header">
        <span class="careful-merge-icon">${typeInfo.icon}</span>
        <h2>マージ方法の確認</h2>
      </div>
      <div class="careful-merge-content">
        <div class="careful-merge-type" style="border-left: 4px solid ${typeInfo.color}">
          <strong>${typeInfo.name}</strong>
          <p>${typeInfo.description}</p>
        </div>
        <p class="careful-merge-question">この方法でマージしてもよろしいですか？</p>
      </div>
      <div class="careful-merge-actions">
        <button class="careful-merge-btn careful-merge-btn-cancel">キャンセル</button>
        <button class="careful-merge-btn careful-merge-btn-confirm" style="background-color: ${typeInfo.color}">
          ${typeInfo.name} を実行
        </button>
      </div>
    `;

    overlay.appendChild(dialog);

    // イベントリスナー
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

    // オーバーレイクリックでキャンセル
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
        onCancel();
      }
    });

    // Escキーでキャンセル
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

  // マージタイプを検出
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

  // マージボタンにインターセプターを追加
  function interceptMergeButton(button) {
    if (button.dataset.carefulMergeIntercepted) {
      return;
    }
    button.dataset.carefulMergeIntercepted = 'true';

    button.addEventListener('click', (e) => {
      // 既に確認済みの場合はスキップ
      if (button.dataset.carefulMergeConfirmed === 'true') {
        button.dataset.carefulMergeConfirmed = 'false';
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const mergeType = detectMergeType(button);

      const dialog = createConfirmDialog(
        mergeType,
        // 確認時
        () => {
          button.dataset.carefulMergeConfirmed = 'true';
          button.click();
        },
        // キャンセル時
        () => {
          // 何もしない
        }
      );

      document.body.appendChild(dialog);
    }, true);
  }

  // PRの詳細ページかどうかを判定
  function isPullRequestPage() {
    return /\/pull\/\d+/.test(window.location.pathname);
  }

  // マージボタンを検索してインターセプト
  function findAndInterceptMergeButtons() {
    // PRの詳細ページでのみ動作
    if (!isPullRequestPage()) {
      return;
    }

    // GitHub の各種マージボタンセレクタ
    const selectors = [
      // 新しいUIのマージボタン
      'button[data-details-container=".js-merge-pr"]',
      '.merge-box-button',
      '.js-merge-commit-button',
      // マージフォームの送信ボタン
      '.js-merge-box button[type="submit"]',
      'button.js-merge-commit-button',
      // ドロップダウンからのマージボタン
      '.select-menu-item[data-merge-method]',
      // 最新のGitHub UI
      'button[data-octo-click="merge_pull_request"]',
      '.js-merge-pr button[type="submit"]',
      // マージボタン全般
      '[class*="merge"] button[type="submit"]:not([data-careful-merge-intercepted])',
      'form[action*="merge"] button[type="submit"]:not([data-careful-merge-intercepted])'
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((button) => {
        if (button.disabled) return;
        interceptMergeButton(button);
      });
    });
  }

  // MutationObserverでDOMの変更を監視
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

  // 初期化
  function init() {
    findAndInterceptMergeButtons();
    observeDOM();
  }

  // ページ読み込み後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
