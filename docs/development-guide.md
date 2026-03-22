# 開発ガイド

## 開発環境の前提条件
- Node.js 20+
- Docker Desktop
- Git

## 開発フロー

### 1. 機能開発の開始
```bash
# feature ブランチ作成
git checkout -b feature/xxx

# Docker で開発環境を起動
make dev
```

### 2. TDD サイクル
1. **受け入れ条件を定義**: 何を達成すべきかを明確にする
2. **失敗するテストを書く**: テストが Red であることを確認
3. **最小実装で通す**: テストが Green になる最小コードを書く
4. **リファクタリング**: コード品質を改善

### 3. テスト実行
```bash
# ユニットテスト
make test-unit

# インテグレーションテスト
make test-integration

# E2E テスト
make test-e2e
```

### 4. PR 作成前チェック
```bash
make lint
make build
make test
```

## API 開発

### 新しいモジュールの追加
```bash
# NestJS CLI でモジュール生成
cd apps/api
npx nest generate module feature-name
npx nest generate controller feature-name
npx nest generate service feature-name
```

### Prisma スキーマの変更
```bash
# スキーマファイルを編集
vi apps/api/prisma/schema.prisma

# マイグレーション作成
make db-migrate

# Prisma Client 再生成
make db-generate
```

## フロントエンド開発

### 新しいページの追加
`apps/web/src/app/` 配下にディレクトリとファイルを作成する。
Next.js App Router のファイルベースルーティングに従う。

### API との連携
`apps/web/src/lib/api-client.ts` の `apiClient` を使用する。

## Docker 操作

### よく使うコマンド
```bash
make dev          # 全サービス起動
make stop         # 停止
make rebuild      # 再ビルド
make logs         # ログ確認
make logs-api     # API ログのみ
make clean        # 全削除
```

### DB 操作
```bash
make db-migrate   # マイグレーション
make db-seed      # シードデータ投入
make db-studio    # Prisma Studio
make db-reset     # リセット
```

## トラブルシューティング

### ポートが使用中
```bash
# 使用中のプロセスを確認
lsof -i :3000
lsof -i :3001
lsof -i :5432
```

### Docker コンテナが起動しない
```bash
# ログを確認
docker compose logs api
docker compose logs web

# 再ビルド
make rebuild
```

### Prisma エラー
```bash
# Client を再生成
make db-generate

# マイグレーションをリセット
make db-reset
```
