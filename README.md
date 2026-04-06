# ai-webapp-starter-azure

AI 特化 Web サービス開発用スターターリポジトリ。  
Next.js + NestJS + Prisma + LLM 統合を軸に、Claude Code の agents/skills 設計、Docker ベースのローカル開発、Azure 配備まで一気通貫で提供する。

---

## ✨ できること

- **AI チャットアプリ**の即時構築（OpenAI / Azure OpenAI 対応、指数バックオフ付きリトライ）
- **RAG（検索拡張生成）** パイプラインの土台構築（ベクトル埋め込み生成対応済み）
- **Claude Code agents/skills** による AI 駆動開発（10 agents、28 skills 搭載）
- **TDD・E2E 完備**のテスト駆動開発（Jest + Playwright）
- **Docker 完結**のローカル開発（`make dev` 一発起動）
- **Azure Container Apps** へのワンコマンドデプロイ（Bicep + GitHub Actions CI/CD）
- **Conventional Commits + lint-staged** によるコード品質自動ゲート

---

## 🏗️ 技術スタック

| カテゴリ       | 技術                                                                  |
| -------------- | --------------------------------------------------------------------- |
| フロントエンド | Next.js 15 (App Router), React 19, TypeScript                         |
| バックエンド   | NestJS 10, TypeScript                                                 |
| ORM            | Prisma 5                                                              |
| AI/LLM         | OpenAI SDK, Azure OpenAI（自動切替対応）                              |
| DB             | PostgreSQL 16                                                         |
| テスト         | Jest (unit/integration), Playwright (E2E)                             |
| CI/CD          | GitHub Actions (CI / staging CD / production CD)                      |
| コンテナ       | Docker, Docker Compose                                                |
| クラウド       | Azure Container Apps, ACR, PostgreSQL Flexible Server                 |
| モノレポ       | npm workspaces, Turborepo                                             |
| 品質管理       | ESLint, Prettier, husky, lint-staged, commitlint, cspell, knip, madge |

---

## 📁 ディレクトリ構成

```
.
├── .claude/                     # Claude Code 設計（正本）
│   ├── CLAUDE.md               # プロジェクト横断ルール
│   ├── agents/                 # 判断主体 (10 agents)
│   │   ├── product/            #   product-manager
│   │   ├── engineering/        #   solution-architect, frontend/backend-developer,
│   │   │                       #   ai-engineer, azure-platform-engineer
│   │   └── testing/            #   qa-reviewer, tdd-coach, e2e-tester, security-reviewer
│   └── skills/                 # 再利用可能な実行手順 (28 skills)
│       ├── common/             #   汎用 skills (23 個)
│       └── azure/              #   Azure 専用 skills (5 個)
├── apps/
│   ├── web/                    # Next.js フロントエンド
│   │   ├── src/app/            #   App Router (page, layout, error boundary)
│   │   └── src/lib/            #   API クライアント
│   └── api/                    # NestJS バックエンド
│       ├── src/ai/             #   AI サービス (チャット, 埋め込み, リトライ)
│       ├── src/common/         #   HttpExceptionFilter, LoggingInterceptor
│       ├── src/prisma/         #   PrismaService
│       └── prisma/             #   スキーマ, マイグレーション, シード
├── packages/
│   └── shared/                 # 共有型定義 (ApiResponse, AI types)
├── tests/
│   ├── unit/                   # ユニットテスト方針
│   ├── integration/            # インテグレーションテスト方針
│   └── e2e/                    # Playwright E2E テスト + 設定
├── infra/
│   └── azure/                  # Bicep テンプレート + デプロイスクリプト
├── .github/workflows/          # CI/CD (ci.yml, cd-staging.yml, cd-production.yml)
├── docs/                       # 設計ドキュメント
├── docker-compose.yml          # ローカル開発用（dev DB + test DB）
├── Makefile                    # 全操作コマンド集
└── 品質設定ファイル群
    ├── .eslintrc.js            # ESLint (no-console, no-any 強制)
    ├── .prettierrc             # Prettier
    ├── .commitlintrc.json      # Conventional Commits 規約
    ├── .cspell.json            # スペルチェック辞書
    ├── tsconfig.base.json      # TypeScript 共通設定
    └── .husky/                 # Git hooks (pre-commit, commit-msg)
```

---

## 🚀 初回セットアップ

### 前提条件

- Node.js 20+
- Docker Desktop
- Git

### Docker を使ったセットアップ（推奨）

```bash
# リポジトリのクローン
git clone https://github.com/DSasakiBusiness/ai-webapp-starter-azure.git
cd ai-webapp-starter-azure

# 初回セットアップ (依存関係 + DB + マイグレーション + シード)
make setup

# 全サービスを Docker で起動
make dev
```

起動後のアクセス先：

| サービス | URL                         |
| -------- | --------------------------- |
| Web      | http://localhost:3000       |
| API      | http://localhost:3001/api   |
| DB       | postgresql://localhost:5432 |

### ローカルセットアップ（Docker なし）

```bash
npm install
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# DB のみ Docker で起動
docker compose up -d db

# Prisma セットアップ
cd apps/api && npx prisma generate && npx prisma migrate dev && npx prisma db seed && cd ../..

# 開発サーバー起動
npm run dev
```

---

## 🤖 AI 機能

### チャット API

`POST /api/ai/chat` でチャット補完を実行。指数バックオフ付きリトライ (最大 3 回) 内蔵。

```json
// リクエスト
{
  "messages": [
    { "role": "user", "content": "こんにちは" }
  ]
}

// レスポンス
{
  "success": true,
  "data": {
    "content": "こんにちは！お手伝いできることはありますか？",
    "model": "gpt-4o",
    "usage": { "promptTokens": 10, "completionTokens": 20, "totalTokens": 30 }
  }
}
```

### OpenAI / Azure OpenAI 自動切替

環境変数で切り替え。`AZURE_OPENAI_ENDPOINT` が設定されていれば Azure 経由、なければ OpenAI 直接。

```env
# OpenAI 直接
OPENAI_API_KEY=sk-xxxxx

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=xxxxx
AZURE_OPENAI_DEPLOYMENT=gpt-4o
AZURE_OPENAI_API_VERSION=2024-08-01-preview
```

### AI エンジニアが準拠するデザインパターン

`ai-engineer` エージェントに 8 つのエージェントデザインパターンを定義済み（[awesome-agentic-patterns](https://github.com/nibzard/awesome-agentic-patterns) ベース）:

| #   | パターン                                           | 重要度   |
| --- | -------------------------------------------------- | -------- |
| 1   | Structured Output Specification (Zod 型安全化)     | **必須** |
| 2   | Plan-then-Execute (計画と実行の分離)               | **必須** |
| 3   | Budget-Aware Model Routing (コスト制御)            | **必須** |
| 4   | Failover-Aware Model Fallback (障害時自動切替)     | **必須** |
| 5   | Self-Critique Evaluator Loop (品質再生成)          | 推奨     |
| 6   | Hook-Based Safety Guard Rails (入出力セキュリティ) | **必須** |
| 7   | LLM Observability (メトリクス・コスト追跡)         | **必須** |
| 8   | Prompt Caching (プレフィックスキャッシュ)          | 推奨     |

---

## 🧪 テスト

```bash
# 全テスト
make test

# ユニットテスト
make test-unit

# ユニットテスト (ウォッチモード)
make test-unit-watch

# インテグレーションテスト
make test-integration

# インテグレーションテスト (テスト用 DB を Docker で起動)
make test-integration-docker

# E2E テスト (Playwright)
make test-e2e

# E2E テスト (全サービスを Docker で起動して実行)
make test-e2e-docker

# Docker 環境で全テスト実行
make test-docker
```

### テスト方針

| 種別        | 対象                                     | 外部依存         |
| ----------- | ---------------------------------------- | ---------------- |
| Unit        | ビジネスロジック、バリデーション、型変換 | モック           |
| Integration | API エンドポイント、DB 操作、認証        | テスト DB        |
| E2E         | ユーザーフロー全体、エラー表示、再試行   | 全サービス       |
| AI 品質     | 構造評価、境界条件、引用検証             | 評価データセット |

---

## 🔧 品質管理ツール

### Git hooks（自動実行）

| フック       | ツール      | 動作                                             |
| ------------ | ----------- | ------------------------------------------------ |
| `pre-commit` | lint-staged | ステージファイルに Prettier + ESLint を自動適用  |
| `commit-msg` | commitlint  | Conventional Commits (`feat:`, `fix:` 等) を強制 |

### 品質チェックコマンド

```bash
# === 一括実行 ===
make quality              # lint + format + spell + knip + circular 全チェック

# === 個別実行 ===
make lint                 # ESLint (no-console, no-any 強制)
make format               # Prettier 自動整形
make format-check         # Prettier チェックのみ (CI 用)
make spell                # cspell スペルチェック
make knip                 # 未使用コード・export・依存の検出
make circular             # 循環依存の検出 (madge)
make deps-check           # 未使用 dependencies の検出 (depcheck)
make deps-update          # 依存パッケージ更新チェック (ncu)
make sort-pkg             # package.json のキーをソート
```

### ESLint ルール (CLAUDE.md 準拠)

- `no-console`: **error** (NestJS `Logger` を使用)
- `@typescript-eslint/no-explicit-any`: **error** (`unknown` + 型ガードを使用)
- テストファイルでは `console` 許可

---

## 🐳 Docker 操作

```bash
make dev              # 全サービス起動 (web:3000, api:3001, db:5432)
make dev-local        # DB のみ Docker、アプリはローカル起動
make stop             # 停止
make restart          # 再起動
make rebuild          # コンテナ再ビルド (キャッシュなし)
make logs             # 全ログ表示
make logs-api         # API ログのみ
make logs-web         # Web ログのみ
make clean            # コンテナ・ボリューム・node_modules 全削除
make docker-shell-api # API コンテナにシェル接続
make docker-shell-web # Web コンテナにシェル接続
make docker-shell-db  # DB コンテナに psql 接続
```

---

## 🗄️ データベース (Prisma)

### スキーマ概要

| モデル          | 説明                                           |
| --------------- | ---------------------------------------------- |
| `User`          | ユーザー管理 (email, role)                     |
| `Conversation`  | AI 会話セッション                              |
| `Message`       | 会話内の個別メッセージ (role, content, tokens) |
| `Document`      | RAG 用ドキュメント管理                         |
| `DocumentChunk` | ドキュメントのチャンク (embedding 付き)        |

### 操作コマンド

```bash
make db-migrate            # マイグレーション実行 (Docker 経由)
make db-migrate-local      # マイグレーション実行 (ローカル)
make db-migrate-create NAME=xxx  # 新規マイグレーション作成
make db-seed               # シードデータ投入
make db-studio             # Prisma Studio 起動 (ローカル)
make db-reset              # DB リセット (全データ削除 + 再マイグレーション)
make db-generate           # Prisma Client 再生成
```

---

## 🤖 Claude Code Agents & Skills

### Agents (10 体)

| Agent                     | 役割                          | 使うタイミング                       |
| ------------------------- | ----------------------------- | ------------------------------------ |
| `product-manager`         | 要件定義、MVP 判断、優先度    | 要件が曖昧、MVP を絞りたい           |
| `solution-architect`      | 全体設計、非機能要件          | 構成判断、責務境界の決定             |
| `frontend-developer`      | Next.js UI 実装               | UI コンポーネント、ページ実装        |
| `backend-developer`       | NestJS API 実装、DB 設計      | API、Prisma スキーマ変更             |
| `ai-engineer`             | LLM 統合、RAG、プロンプト設計 | AI 機能の実装・品質評価              |
| `qa-reviewer`             | 品質レビュー、テスト戦略      | コード品質の確認                     |
| `tdd-coach`               | TDD サイクル強制              | 実装着手前のテスト設計               |
| `e2e-tester`              | Playwright E2E テスト         | ユーザーフロー検証                   |
| `security-reviewer`       | PentAGI セキュリティ検証      | ステージング環境でのセキュリティ確認 |
| `azure-platform-engineer` | Azure 設計・デプロイ・監視    | Azure 固有の運用                     |

### Skills (28 個)

<details>
<summary>共通 Skills (23 個)</summary>

`clarify-product-requirements`, `define-mvp`, `implement-nextjs-ui`, `implement-nestjs-api`, `implement-prisma-schema`, `integrate-llm-feature`, `build-rag-pipeline`, `tdd-feature-delivery`, `e2e-readiness-pipeline`, `review-security-with-pentagi`, `run-ai-evals`, `review-ai-output-quality`, `review-performance`, `write-api-contract`, `generate-ui-spec`, `secure-release-pipeline`, `setup-pentagi-scan`, `review-release-readiness`, `clarify-ai-requirements`, `clarify-test-scope`, `setup-docker-dev-environment`, `run-tests-in-docker`, `manage-prisma-in-docker`

</details>

<details>
<summary>Azure 専用 Skills (5 個)</summary>

`design-azure-architecture`, `deploy-to-azure`, `setup-azure-ci-cd`, `configure-azure-secrets`, `monitor-on-azure`

</details>

---

## ☁️ Azure デプロイ

### 前提条件

- Azure CLI (`az`) がインストール済み
- `az login` でログイン済み

### デプロイ

```bash
# ステージング
cd infra/azure && ./scripts/deploy.sh staging

# 本番
./scripts/deploy.sh production
```

### CI/CD パイプライン

| トリガー                       | アクション                           |
| ------------------------------ | ------------------------------------ |
| PR / push to `main`, `develop` | CI (lint, format check, test, build) |
| push to `develop`              | ステージング自動デプロイ             |
| `v*` タグ push                 | 本番デプロイ（手動承認付き）         |

---

## 🔒 セキュリティ

### PentAGI セキュリティレビュー

> ⚠️ **重要**: PentAGI は本番環境に対して**絶対に実行しない**こと。ステージングまたは隔離環境限定。

1. ステージング環境にデプロイ
2. `.env` に `PENTAGI_*` 変数を設定
3. `security-reviewer` agent に依頼
4. 結果を critical / high / medium / low で分類
5. **人間が再確認**してから修正に着手

### 実装時の禁止事項

- ❌ `any` 型の使用（`unknown` + 型ガードを使う）
- ❌ `console.log` のコミット（NestJS の `Logger` を使う）
- ❌ 秘密情報のハードコード
- ❌ テストなしの機能追加
- ❌ 環境変数の直接参照（`ConfigService` 経由で取得する）

---

## 🧩 拡張方法

### 新しい API モジュールの追加

```bash
cd apps/api
npx nest generate module modules/feature-name
npx nest generate controller modules/feature-name
npx nest generate service modules/feature-name
```

### 新しいスキーマの追加

1. `apps/api/prisma/schema.prisma` にモデルを追加
2. `make db-migrate-create NAME=add_new_model`
3. `make db-generate` で Prisma Client 再生成

### 新しい Agent / Skill の追加

- Agent: `.claude/agents/<category>/` に `.md` ファイルを追加
- Skill: `.claude/skills/<category>/<skill-name>/SKILL.md` を作成

---

## 📝 コミット規約

[Conventional Commits](https://www.conventionalcommits.org/) を強制（commitlint による自動検証）。

```
<type>: <subject>     (100 文字以内)

[optional body]
[optional footer]
```

使用可能な type:

| type       | 用途               |
| ---------- | ------------------ |
| `feat`     | 新機能             |
| `fix`      | バグ修正           |
| `docs`     | ドキュメント       |
| `style`    | フォーマット変更   |
| `refactor` | リファクタリング   |
| `perf`     | パフォーマンス改善 |
| `test`     | テスト追加・修正   |
| `build`    | ビルド・依存関係   |
| `ci`       | CI/CD 設定         |
| `chore`    | その他雑務         |
| `revert`   | リバート           |

---

## 📄 ライセンス

[MIT License](LICENSE)
