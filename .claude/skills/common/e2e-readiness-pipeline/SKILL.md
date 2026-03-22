---
name: e2e-readiness-pipeline
description: Playwright E2E テストの設計・実装・環境整備の手順
---

# E2E Readiness Pipeline

## この skill を使う場面
- E2E テストを新規追加する場合
- E2E テスト環境を整備する場合

## 入力前提
- テスト対象の機能が実装済み
- ページに id / role 属性が付与済み

## 実行手順

### Step 1: テストシナリオ定義
ユーザーフローを「操作 → 期待結果」のペアで定義:
```
1. トップページにアクセス → タイトルが表示される
2. チャット入力欄にメッセージを入力 → 送信ボタンが有効になる
3. 送信ボタンをクリック → ローディング表示 → AI レスポンスが表示される
```

### Step 2: 前提データの準備
- seed スクリプトでテスト用データを投入
- 認証が必要な場合は test 用の認証情報を準備

### Step 3: テスト実装
```typescript
import { test, expect } from '@playwright/test';

test.describe('チャット機能', () => {
  test('メッセージを送信して応答を受け取る', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('#chat-input');
    await input.fill('テストメッセージ');
    await page.locator('#send-button').click();
    await expect(page.locator('.message-assistant')).toBeVisible({ timeout: 30000 });
  });
});
```

### Step 4: CI 設定確認
- `.github/workflows/ci.yml` の E2E ジョブが正常に動くことを確認
- Docker 環境での実行: `make test-e2e-docker`

## 判断ルール
- id / role ベースのセレクターを優先する
- テキスト完全一致は避ける (`toContainText` を使う)
- 各テストは独立して実行可能であること
- AI レスポンスのテストは長めのタイムアウト (30秒) を設定

## 出力形式
- `tests/e2e/specs/[feature].spec.ts`
- 必要に応じて `tests/e2e/fixtures/` にテストデータ

## 注意点
- E2E テストは実行コストが高いため、重要なフローに限定する
- API モックは最小限にする（実際のフローを検証する）
- スクリーンショットとトレースを失敗時に自動保存する

## 失敗時の扱い
- flaky テスト: `test.retry(2)` を設定し、根本原因を調査
- タイムアウト: サーバーの起動を待つ処理を見直す
- セレクター変更: frontend-developer に id 属性の復元・追加を依頼
