# アーキテクチャ

## 全体構成

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Next.js    │────▶│   NestJS     │────▶│  PostgreSQL  │
│   (Web)      │     │   (API)      │     │   (DB)       │
│   Port:3000  │     │   Port:3001  │     │   Port:5432  │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                     ┌──────▼───────┐
                     │  OpenAI /    │
                     │  Azure OpenAI│
                     │  (LLM)      │
                     └──────────────┘
```

## レイヤー構成

### フロントエンド (apps/web)
- Next.js 15 (App Router)
- React 19
- TypeScript
- Vanilla CSS

### バックエンド (apps/api)
- NestJS 10
- TypeScript
- Prisma ORM
- OpenAI SDK

### データベース
- PostgreSQL 16
- Prisma Migrations

### AI/LLM 統合
- OpenAI API (直接)
- Azure OpenAI (Azure 経由)
- RAG パイプライン (将来拡張)

## データフロー

1. ユーザーが Web UI でメッセージを入力
2. Next.js が API サーバーにリクエスト送信
3. NestJS が入力バリデーション実行
4. AI サービスが LLM API を呼び出し
5. レスポンスを DB に保存
6. 結果を Web UI に返却

## セキュリティ

- API 入力バリデーション (class-validator)
- CORS 設定
- 環境変数による秘密情報管理
- SQL インジェクション対策 (Prisma ORM)
- XSS 対策 (React の自動エスケープ)
