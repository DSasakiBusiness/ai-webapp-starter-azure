# E2E テスト

## 方針
- Playwright を使用
- ユーザーの操作フローを再現する
- brittle な selector や過剰な文言固定を避ける
- data-testid または id 属性を優先使用
- テスト前提データは seed スクリプトで投入

## 実行方法
```bash
# ローカル（全サービス起動が必要）
make dev
npm run test:e2e

# Docker 環境
make test-e2e-docker

# UI モードで実行
npx playwright test --ui --config=tests/e2e/playwright.config.ts
```

## テストカテゴリ
1. **ヘルスチェック**: ページ表示、API 接続
2. **認証**: ログイン、ログアウト、権限制御
3. **基本 CRUD**: データの作成・読取・更新・削除
4. **AI 機能**: チャット送信・応答表示、エラーハンドリング
5. **失敗時表示**: ネットワークエラー、API エラー時の UI 挙動
6. **再試行導線**: エラー発生後のリトライ操作

## 壊れにくいテスト設計
- `page.locator('#chat-input')` のように id を使う
- `page.getByRole('button', { name: '送信' })` のようにアクセシビリティロールを使う
- テキスト完全一致ではなく `toContainText` を使う
- テスト間でデータ依存を作らない
