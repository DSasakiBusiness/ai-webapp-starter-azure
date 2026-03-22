# ============================================
# ai-webapp-starter-azure Makefile
# ============================================
# Docker ベースの開発操作を統一するコマンド集

.PHONY: help setup dev stop restart rebuild logs clean \
        db-migrate db-seed db-studio db-reset db-generate \
        test test-unit test-integration test-e2e test-docker \
        lint format format-check spell knip circular \
        deps-check deps-update sort-pkg quality build \
        docker-shell-api docker-shell-web docker-shell-db

# デフォルト
help: ## コマンド一覧を表示
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-24s\033[0m %s\n", $$1, $$2}'

# ============================================
# セットアップ
# ============================================
setup: ## 初回セットアップ (依存関係インストール + DB起動 + マイグレーション)
	cp -n .env.example .env || true
	npm install
	docker compose up -d db
	@echo "⏳ Waiting for database to be ready..."
	@sleep 5
	cd apps/api && npx prisma generate
	cd apps/api && npx prisma migrate dev
	cd apps/api && npx prisma db seed
	@echo "✅ セットアップ完了"
	@echo "  次のステップ: make dev"

# ============================================
# 開発
# ============================================
dev: ## Docker Compose で全サービスを起動 (web + api + db)
	docker compose up -d
	@echo "✅ 起動完了"
	@echo "  Web: http://localhost:3000"
	@echo "  API: http://localhost:3001/api"
	@echo "  DB:  postgresql://localhost:5432"

dev-local: ## ローカルで dev サーバーを起動 (Docker なし、DB のみ Docker)
	docker compose up -d db
	@sleep 2
	npm run dev

stop: ## 全サービスを停止
	docker compose down

restart: ## 全サービスを再起動
	docker compose down
	docker compose up -d

rebuild: ## コンテナを再ビルドして起動 (キャッシュなし)
	docker compose up -d --build --force-recreate

logs: ## 全サービスのログを表示
	docker compose logs -f

logs-api: ## API サーバーのログを表示
	docker compose logs -f api

logs-web: ## Web サーバーのログを表示
	docker compose logs -f web

clean: ## コンテナ・ボリューム・node_modules を全削除
	docker compose down -v --remove-orphans
	rm -rf node_modules apps/*/node_modules packages/*/node_modules
	rm -rf apps/web/.next apps/api/dist
	rm -rf coverage apps/*/coverage
	@echo "✅ クリーン完了"

# ============================================
# データベース
# ============================================
db-generate: ## Prisma Client 再生成
	docker compose exec api sh -c "cd apps/api && npx prisma generate"

db-migrate: ## Prisma マイグレーション実行
	docker compose exec api sh -c "cd apps/api && npx prisma migrate dev"

db-migrate-create: ## Prisma マイグレーション作成 (名前指定: make db-migrate-create NAME=xxx)
	docker compose exec api sh -c "cd apps/api && npx prisma migrate dev --name $(NAME)"

db-migrate-local: ## Prisma マイグレーション実行 (ローカル)
	cd apps/api && npx prisma migrate dev

db-seed: ## Prisma シードデータ投入
	docker compose exec api sh -c "cd apps/api && npx prisma db seed"

db-studio: ## Prisma Studio 起動 (ローカルのみ)
	cd apps/api && npx prisma studio

db-reset: ## データベースをリセット (全データ削除 + 再マイグレーション + シード)
	docker compose exec api sh -c "cd apps/api && npx prisma migrate reset --force"

# ============================================
# テスト
# ============================================
test: ## 全テストを実行 (unit + integration)
	npm run test:unit
	npm run test:integration

test-unit: ## ユニットテストを実行
	npm run test:unit

test-unit-watch: ## ユニットテストをウォッチモードで実行
	cd apps/api && npx jest --watch --testPathPattern='.+\.spec\.ts$$'

test-integration: ## インテグレーションテストを実行 (テスト用 DB が必要)
	npm run test:integration

test-integration-docker: ## テスト用 DB を起動してインテグレーションテスト実行
	docker compose --profile test up -d db-test
	@sleep 3
	DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ai_webapp_test npm run test:integration
	docker compose --profile test stop db-test

test-e2e: ## E2E テストを実行 (Playwright、サーバー起動済み前提)
	npm run test:e2e

test-e2e-docker: ## Docker 環境で E2E テスト実行
	docker compose up -d
	@echo "⏳ Waiting for services..."
	@sleep 8
	@npx wait-on http://localhost:3000 http://localhost:3001/api/health --timeout 60000
	npm run test:e2e
	docker compose down

test-docker: ## テスト用 DB + Docker で全テスト実行
	docker compose --profile test up -d db-test
	@sleep 3
	DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ai_webapp_test npm run test:unit
	DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ai_webapp_test npm run test:integration
	docker compose --profile test stop db-test
	@echo "✅ 全テスト完了"

# ============================================
# コード品質
# ============================================
lint: ## リントチェック
	npm run lint

format: ## コードフォーマット
	npm run format

format-check: ## フォーマットチェック (CI 用、変更なし)
	npm run format:check

spell: ## スペルチェック (cspell)
	npm run spell

knip: ## 未使用コード・export・依存の検出
	npm run knip

circular: ## 循環依存の検出 (madge)
	npm run circular

deps-check: ## 未使用 dependencies の検出 (depcheck)
	npm run deps:check

deps-update: ## 依存パッケージ更新チェック (ncu)
	npm run deps:update

sort-pkg: ## package.json のキーをソート
	npm run sort-pkg

quality: ## 全品質チェックを一括実行 (lint + format + spell + knip + circular)
	npm run quality

build: ## プロダクションビルド
	npm run build

# ============================================
# Docker ユーティリティ
# ============================================
docker-shell-api: ## API コンテナにシェル接続
	docker compose exec api sh

docker-shell-web: ## Web コンテナにシェル接続
	docker compose exec web sh

docker-shell-db: ## DB コンテナに psql 接続
	docker compose exec db psql -U $${POSTGRES_USER:-postgres} -d $${POSTGRES_DB:-ai_webapp_dev}

