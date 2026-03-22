---
name: run-tests-in-docker
description: Docker 環境でテストを実行する手順
---
# Run Tests in Docker
## この skill を使う場面
- CI と同じ環境でテストを実行したい場合
- ローカル環境の差異によるテスト失敗を避けたい場合
## 入力前提
- Docker Compose で開発環境が起動可能
## 実行手順
### Step 1: テスト用 DB 確認
```bash
docker compose up -d db
docker compose exec db pg_isready
```
### Step 2: ユニットテスト
```bash
make test-unit
# Docker コンテナ内で実行する場合
docker compose exec api npm run test:unit
```
### Step 3: インテグレーションテスト
```bash
make test-integration
# Docker コンテナ内で実行する場合
docker compose exec api npm run test:integration
```
### Step 4: E2E テスト
```bash
make test-e2e-docker
```
### Step 5: 結果確認
テスト結果とカバレッジを確認。
## 判断ルール
- CI と同じ Node.js バージョンを使う
- テスト用 DB は `ai_webapp_test` を使う
## 出力形式
テスト実行結果 (通過数/失敗数/カバレッジ)
## 注意点
- テスト用の環境変数を設定すること (_test DB 等)
## 失敗時の扱い
- DB 接続エラー: コンテナの起動状態を確認
- タイムアウト: コンテナのリソース割り当てを確認
