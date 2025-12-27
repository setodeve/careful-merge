# Careful Merge

[English version](README.md)

GitHubのプルリクエストでマージボタンをクリックした際に、選択したマージ方法を確認するダイアログを表示するChrome拡張機能です。

## 機能

- **マージ方法の確認**: マージ、スカッシュマージ、リベースマージのいずれかを選択した際に確認ダイアログを表示
- **視覚的な区別**: 各マージ方法を色とアイコンで区別
- **ダークモード対応**: GitHubのダークモードに自動対応
- **キーボードショートカット**: Escキーでダイアログをキャンセル

## インストール方法

### ソースから

1. このリポジトリをクローン
2. 依存関係をインストール: `pnpm install`
3. 拡張機能をビルド: `pnpm build`
4. Chrome で `chrome://extensions` を開く
5. 右上の「デベロッパーモード」を有効にする
6. 「パッケージ化されていない拡張機能を読み込む」をクリック
7. `.output/chrome-mv3` フォルダを選択

## 開発

```bash
pnpm install         # 依存関係のインストール
pnpm dev             # 開発モード（HMR対応）
pnpm build           # 本番ビルド
pnpm storybook       # Storybookでコンポーネントをプレビュー
```

## 使い方

1. GitHubのプルリクエストページを開く
2. 通常通りマージボタンをクリック
3. 確認ダイアログが表示される
4. 「Confirm [マージ方法]」をクリックしてマージを続行、または「Cancel」で中止

## 対応するマージ方法

| マージ方法         | 説明                                             |
| ------------------ | ------------------------------------------------ |
| Merge commit       | すべてのコミットを保持してマージコミットを作成   |
| Squash and merge   | すべてのコミットを1つにまとめてマージ            |
| Rebase and merge   | コミットをベースブランチにリベースしてマージ     |

## 技術スタック

- [WXT](https://wxt.dev/) - Web拡張機能フレームワーク
- TypeScript
- [Storybook](https://storybook.js.org/) - コンポーネントプレビュー

## プロジェクト構成

```text
careful-merge/
├── entrypoints/
│   └── content.ts          # コンテントスクリプト
├── components/
│   └── ConfirmDialog.ts    # ダイアログコンポーネント
├── types/
│   └── index.ts            # 型定義
├── assets/
│   └── styles.css          # ダイアログのスタイル
├── stories/
│   └── ConfirmDialog.stories.ts
├── .storybook/             # Storybook設定
├── wxt.config.ts           # WXT設定
└── package.json
```

## ライセンス

MIT License
