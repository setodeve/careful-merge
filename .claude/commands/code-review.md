## Implementation

コードのレビューをします。

### 使用方法

- `/code-review` - 現在のブランチの変更点（ステージング含む）のみをレビュー
- `/code-review <branch-name>` - 指定したブランチとの差分をレビュー
  - 例: `/code-review main`, `/code-review develop`

### レビュー実行手順

**引数確認**: "{{$ARGS}}"

**引数が空の場合**:

1. `git diff --cached` を実行してステージングされた変更を確認
2. `git diff` を実行してステージングされていない変更を確認
3. 両方の変更点をレビュー対象とする

**引数がある場合（ブランチ名: {{$ARGS}}）**:

1. `git diff {{$ARGS}} --stat` を実行して変更ファイル一覧を取得
2. `git diff {{$ARGS}}` を実行して {{$ARGS}} ブランチとの全差分を取得
3. その差分をレビュー対象とする

### レビュー項目

以下の内容を入念に確認してください：

- **実装がアーキテクチャに完璧に沿っているか**
- **テストが網羅されているか**
- **domain が適切に実装されているか**
- **DTO などの class 名、関数名がアーキテクチャに沿ったものになっているか**
- **レビュー後に違反があった場合は修正するための方針を作成してください。**

参照ファイル: **README.md**,**docs/architecture.md**,**docs/atomicdesign.md**,**docs/coding-style.md**,**docs/di-guide.md**,**docs/error-handling.md**