# ai-webapp-starter-azure

AI 特化 Web サービス開発用スターターリポジトリ。  
Next.js + NestJS + Prisma + LLM 統合を軸に、Claude Code の agents/skills 設計、Docker ベースのローカル開発、Azure 配備まで一気通貫で提供する。

## 想定ユースケース

- AI チャットボットサービスの構築
- RAG (検索拡張生成) ベースの質問応答システム
- LLM を活用した業務支援 Web アプリケーション
- AI SaaS のプロトタイピング

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フロントエンド | Next.js 15, React 19, TypeScript |
| バックエンド | NestJS 10, TypeScript |
| ORM | Prisma 5 |
| AI/LLM | OpenAI SDK, Azure OpenAI |
| DB | PostgreSQL 16 |
| テスト | Jest, Playwright |
| CI/CD | GitHub Actions |
| コンテナ | Docker, Docker Compose |
| クラウド | Azure Container Apps, ACR, PostgreSQL Flexible Server |
| モノレポ | npm workspaces, Turborepo |

## ディレクトリ構成

```
.
├── .claude/                    # Claude Code 設計
│   ├── CLAUDE.md              # プロジェクト横断ルール
│   ├── agents/                # 判断主体 (agent)
│   │   ├── product/           # product-manager
│   │   ├── engineering/       # solution-architect, frontend/backend-developer, ai-engineer, azure-platform-engineer
│   │   └── testing/           # qa-reviewer, tdd-coach, e2e-tester, security-reviewer
│   └── skills/                # 再利用可能な実行手順 (skill)
│       ├── common/            # 共通 skills (23個)
│       └── azure/             # Azure 専用 skills (5個)
├── apps/
│   ├── web/                   # Next.js フロントエンド
│   └── api/                   # NestJS バックエンド + Prisma
├── packages/
│   └── shared/                # 共有型定義
├── tests/
│   ├── unit/                  # ユニットテスト方針
│   ├── integration/           # インテグレーションテスト方針
│   └── e2e/                   # Playwright E2E テスト
├── infra/
│   └── azure/                 # Bicep テンプレート + デプロイスクリプト
├── .github/
│   └── workflows/             # CI/CD (ci.yml, cd-staging.yml, cd-production.yml)
├── docs/                      # 設計ドキュメント
├── docker-compose.yml         # ローカル開発用
├── Makefile                   # 操作コマンド集
└── README.md
```

## Agents 一覧

| Agent | 役割 |
|-------|------|
| product-manager | 要件定義、MVP 判断、優先度決定 |
| solution-architect | 全体設計、責務境界、非機能要件、クラウド構成方針 |
| frontend-developer | Next.js UI 実装、UX 設計 |
| backend-developer | NestJS API 実装、DB 設計 |
| ai-engineer | LLM 統合、RAG パイプライン、AI 品質評価 |
| qa-reviewer | 品質レビュー、テスト戦略 |
| tdd-coach | TDD サイクル強制、受け入れ条件定義 |
| e2e-tester | Playwright E2E テスト設計・実装 |
| security-reviewer | PentAGI によるセキュリティレビュー |
| azure-platform-engineer | Azure 固有の設計・デプロイ・監視 |

## Skills 一覧

### 共通 Skills
clarify-product-requirements, define-mvp, implement-nextjs-ui, implement-nestjs-api, implement-prisma-schema, integrate-llm-feature, build-rag-pipeline, tdd-feature-delivery, e2e-readiness-pipeline, review-security-with-pentagi, run-ai-evals, review-ai-output-quality, review-performance, write-api-contract, generate-ui-spec, secure-release-pipeline, setup-pentagi-scan, review-release-readiness, clarify-ai-requirements, clarify-test-scope, setup-docker-dev-environment, run-tests-in-docker, manage-prisma-in-docker

### Azure 専用 Skills
design-azure-architecture, deploy-to-azure, setup-azure-ci-cd, configure-azure-secrets, monitor-on-azure

## 初回セットアップ

### 前提条件
- Node.js 20+
- Docker Desktop
- Git

### Docker を使ったセットアップ（推奨）
```bash
# リポジトリのクローン
git clone https://github.com/your-org/ai-webapp-starter-azure.git
cd ai-webapp-starter-azure

# 初回セットアップ（依存関係インストール + DB起動 + マイグレーション + シード）
make setup

# 全サービスを Docker で起動
make dev
```

### ローカルセットアップ（Docker なし）
```bash
# 依存関係インストール
npm install

# 環境変数ファイルの作成
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# DBのみ Docker で起動
docker compose up -d db

# Prisma セットアップ
cd apps/api
npx prisma generate
npx prisma migrate dev
npx prisma db seed
cd ../..

# 開発サーバー起動
npm run dev
```

## Docker Compose 操作

```bash
make dev          # 全サービス起動 (web:3000, api:3001, db:5432)
make stop         # 停止
make restart      # 再起動
make rebuild      # コンテナ再ビルド
make logs         # 全ログ表示
make logs-api     # API ログのみ
make logs-web     # Web ログのみ
make clean        # コンテナ・ボリューム・node_modules 全削除
```

## Prisma 操作

```bash
make db-migrate   # マイグレーション実行 (Docker 経由)
make db-seed      # シードデータ投入
make db-studio    # Prisma Studio 起動 (ローカル)
make db-reset     # DB リセット（全データ削除 + 再マイグレーション）
make db-generate  # Prisma Client 再生成
```

## テスト実行

```bash
# 全テスト
make test

# ユニットテスト
make test-unit

# インテグレーションテスト
make test-integration

# E2E テスト (Playwright)
make test-e2e

# E2E テスト (Docker 環境)
make test-e2e-docker
```

## PentAGI セキュリティレビュー

> ⚠️ **重要**: PentAGI は本番環境に対して絶対に実行しないでください。ステージングまたは隔離環境限定です。

1. ステージング環境にデプロイ
2. PentAGI の設定ファイルを準備（`.env` に `PENTAGI_*` 変数を設定）
3. `security-reviewer` agent に依頼、または手動で `review-security-with-pentagi` skill を実行
4. 結果を critical / high / medium / low で分類
5. 人間が再確認してから修正に着手

## Azure デプロイ

### 前提条件
- Azure CLI (`az`) がインストール済み
- `az login` でログイン済み

### ステージング
```bash
cd infra/azure
chmod +x scripts/deploy.sh
./scripts/deploy.sh staging
```

### 本番
```bash
./scripts/deploy.sh production
```

### CI/CD
- `develop` ブランチへの push → ステージング自動デプロイ
- `v*` タグの push → 本番デプロイ（手動承認付き）

## 拡張方法

### 新しい API モジュールの追加
```bash
cd apps/api
npx nest generate module modules/feature-name
npx nest generate controller modules/feature-name
npx nest generate service modules/feature-name
```

### 新しいスキーマの追加
1. `apps/api/prisma/schema.prisma` にモデルを追加
2. `make db-migrate` でマイグレーション作成
3. `make db-generate` で Prisma Client 再生成

### 新しい Agent / Skill の追加
- Agent: `.claude/agents/<category>/` に `.md` ファイルを追加
- Skill: `.claude/skills/<category>/<skill-name>/SKILL.md` を追加

## 注意事項

- `.env` ファイルには秘密情報を含むため、**絶対に Git にコミットしない**
- PentAGI を本番環境に対して実行しない
- Azure のパスワードは Key Vault で管理する
- AI 機能のテストは厳密文字一致ではなく構造評価で行う
- Docker ボリュームのデータは `make clean` で削除される
