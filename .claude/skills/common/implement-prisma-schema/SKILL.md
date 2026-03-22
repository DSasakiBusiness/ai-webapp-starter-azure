---
name: implement-prisma-schema
description: Prisma スキーマの設計・更新とマイグレーション実行の手順
---

# Implement Prisma Schema

## この skill を使う場面
- 新しいデータモデルを追加する場合
- 既存のスキーマを変更する場合

## 入力前提
- データモデルの要件が定義済み
- 既存スキーマとの関連性が把握済み

## 実行手順

### Step 1: スキーマ設計
`apps/api/prisma/schema.prisma` を編集し、以下の規約に従う:
- モデル名: PascalCase (`User`, `Conversation`)
- テーブル名: snake_case (`@@map("users")`)
- カラム名: camelCase (Prisma 側) → snake_case (DB 側 `@map("column_name")`)
- 必ず `id`, `createdAt`, `updatedAt` を含める
- リレーションには `onDelete` を明示する

### Step 2: マイグレーション作成
```bash
# Docker 経由
make db-migrate
# ローカル
cd apps/api && npx prisma migrate dev --name describe-change
```

### Step 3: Prisma Client 再生成
```bash
make db-generate
```

### Step 4: シードスクリプト更新
新しいモデルのサンプルデータを `apps/api/prisma/seed.ts` に追加。

### Step 5: 型定義の同期
必要に応じて `packages/shared/src/types/` に共有型を追加。

## 判断ルール
- 既存データに破壊的変更を加える場合は段階的マイグレーションを使う
- JSON カラムよりも正規化を優先する (ただし柔軟なメタデータは JSON 可)
- インデックスはクエリパターンに基づいて追加する

## 出力形式
- `apps/api/prisma/schema.prisma` (スキーマ)
- `apps/api/prisma/migrations/` (マイグレーション)
- `apps/api/prisma/seed.ts` (シード更新)

## 注意点
- マイグレーションファイルは手動編集しない
- `prisma migrate reset` はデータが全削除されるため開発環境限定

## 失敗時の扱い
- マイグレーション競合: `prisma migrate resolve` で解決
- スキーマエラー: `prisma validate` でバリデーション
- データ不整合: `prisma db push`で強制同期（開発環境のみ）
