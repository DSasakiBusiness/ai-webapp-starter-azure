# ============================================
# ai-webapp-starter-azure Makefile
# ============================================
# Docker ベースの開発操作を統一するコマンド集

.PHONY: help setup dev stop restart rebuild logs clean \
        db-migrate db-seed db-studio db-reset \
        test test-unit test-integration test-e2e \
        lint format build \
        docker-shell-api docker-shell-web

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
	@echo "Waiting for database to be ready..."
	@sleep 3
	cd apps/api && npx prisma generate
	cd apps/api && npx prisma migrate dev
	cd apps/api && npx prisma db seed
	@echo "✅ セットアップ完了"

# ============================================
# 開発
# ============================================
dev: ## Docker Compose で全サービスを起動 (web + api + db)
	docker compose up -d
	@echo "✅ 起動完了"
	@echo "  Web: http://localhost:3000"
	@echo "  API: http://localhost:3001"
	@echo "  DB:  postgresql://localhost:5432"

dev-local: ## ローカルで dev サーバーを起動 (Docker なし、DB のみ Docker)
	docker compose up -d db
	npm run dev

stop: ## 全サービスを停止
	docker compose down

restart: ## 全サービスを再起動
	docker compose down
	docker compose up -d

rebuild: ## コンテナを再ビルドして起動
	docker compose up -d --build

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
	@echo "✅ クリーン完了"

# ============================================
# データベース
# ============================================
db-migrate: ## Prisma マイグレーション実行
	docker compose exec api sh -c "cd apps/api && npx prisma migrate dev"

db-migrate-local: ## Prisma マイグレーション実行 (ローカル)
	cd apps/api && npx prisma migrate dev

db-seed: ## Prisma シードデータ投入
	docker compose exec api sh -c "cd apps/api && npx prisma db seed"

db-studio: ## Prisma Studio 起動 (ローカルのみ)
	cd apps/api && npx prisma studio

db-reset: ## データベースをリセット (全データ削除 + 再マイグレーション + シード)
	docker compose exec api sh -c "cd apps/api && npx prisma migrate reset --force"

db-generate: ## Prisma Client 再生成
	docker compose exec api sh -c "cd apps/api && npx prisma generate"

# ============================================
# テスト
# ============================================
test: ## 全テストを実行
	npm run test

test-unit: ## ユニットテストを実行
	npm run test:unit

test-integration: ## インテグレーションテストを実行
	npm run test:integration

test-e2e: ## E2E テストを実行 (Playwright)
	npm run test:e2e

test-e2e-docker: ## E2E テストを Docker 環境で実行
	docker compose up -d
	@sleep 5
	npm run test:e2e
	docker compose down

# ============================================
# コード品質
# ============================================
lint: ## リントチェック
	npm run lint

format: ## コードフォーマット
	npm run format

build: ## プロダクションビルド
	npm run build

# ============================================
# Docker ユーティリティ
# ============================================
docker-shell-api: ## API コンテナにシェル接続
	docker compose exec api sh

docker-shell-web: ## Web コンテナにシェル接続
	docker compose exec web sh

docker-shell-db: ## DB コンテナにシェル接続
	docker compose exec db psql -U $${POSTGRES_USER:-postgres} -d $${POSTGRES_DB:-ai_webapp_dev}
