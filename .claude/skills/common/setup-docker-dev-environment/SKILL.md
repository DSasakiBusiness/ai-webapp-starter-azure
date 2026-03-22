---
name: setup-docker-dev-environment
description: Docker / Docker Compose を使ったローカル開発環境のセットアップ手順
---
# Setup Docker Dev Environment
## この skill を使う場面
- プロジェクトの初回セットアップ
- 開発環境のトラブルシューティング
## 入力前提
- Docker Desktop がインストール済み
- リポジトリがクローン済み
## 実行手順
### Step 1: 環境変数の準備
```bash
cp .env.example .env
```
必要に応じて API キー等を設定。
### Step 2: Docker Compose で起動
```bash
make dev
# または
docker compose up -d
```
### Step 3: 起動確認
```bash
# コンテナの状態確認
docker compose ps

# ログ確認
docker compose logs -f

# ヘルスチェック
curl http://localhost:3001/api/health
```
### Step 4: DB セットアップ
```bash
make db-migrate
make db-seed
```
### Step 5: 動作確認
- Web: http://localhost:3000
- API: http://localhost:3001
- DB: postgresql://localhost:5432
## 判断ルール
- ポート競合がある場合は `.env` で変更
- DB コンテナが healthy になるまで待つ
## 出力形式
セットアップ完了確認 (各サービスの起動状態)
## 注意点
- M1/M2 Mac では `platform: linux/amd64` が必要な場合がある
- ボリュームのパーミッション問題に注意
## 失敗時の扱い
- コンテナが起動しない: `docker compose logs` でエラー確認
- ポート競合: `lsof -i :3000` で確認し、プロセスを終了または `.env` でポート変更
- ビルドエラー: `make rebuild` でキャッシュなしで再ビルド
