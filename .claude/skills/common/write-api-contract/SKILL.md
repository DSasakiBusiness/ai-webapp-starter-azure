---
name: write-api-contract
description: API エンドポイントの契約（インターフェース仕様）を定義する手順
---
# Write API Contract
## この skill を使う場面
- 新しい API エンドポイントを設計する場合
- フロントエンドとバックエンドの連携仕様を定義する場合
## 入力前提
- 機能要件が定義済み
## 実行手順
### Step 1: エンドポイント定義
```markdown
## POST /api/ai/chat
### リクエスト
Content-Type: application/json
{ "messages": [{ "role": "user", "content": "string" }] }
### レスポンス (200)
{ "success": true, "data": { "content": "string", "model": "string", "usage": { "promptTokens": 0, "completionTokens": 0, "totalTokens": 0 } } }
### エラーレスポンス (400)
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "string" } }
```
### Step 2: バリデーションルール定義
各フィールドの型、必須/任意、制約を定義。
### Step 3: エラーコード一覧
アプリケーション全体で使用するエラーコードを統一。
## 判断ルール
- REST 規約に従う
- レスポンス構造は全エンドポイントで統一
## 出力形式
API 契約書 (Markdown)
## 注意点
- 型定義は `packages/shared` と整合させる
## 失敗時の扱い
- 契約に矛盾がある場合: solution-architect に相談
