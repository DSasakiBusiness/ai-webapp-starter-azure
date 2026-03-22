# インテグレーションテスト

## 方針
- 複数モジュール間の連携をテストする
- 実際の DB（テスト用 PostgreSQL）を使う
- ファイル命名: `*.integration.ts`
- テスト前の DB セットアップと後のクリーンアップを必ず行う

## 実行方法
```bash
# ローカル（DB 起動が必要）
docker compose up -d db
npm run test:integration

# Docker
make test-integration
```

## テスト対象
- API エンドポイントの入出力
- Prisma を通じた DB 操作
- AI サービスとの統合（モック使用可）
- 認証フロー

## 注意点
- テスト用 DB は `ai_webapp_test` を使用
- 各テストスイートは独立して実行可能であること
- テストデータは各スイートで作成・削除する
