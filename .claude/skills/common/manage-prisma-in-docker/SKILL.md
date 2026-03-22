---
name: manage-prisma-in-docker
description: Docker 環境での Prisma 操作 (migrate, generate, seed, studio) の手順
---
# Manage Prisma in Docker
## この skill を使う場面
- Docker 環境で DB マイグレーションを行う場合
- Docker 環境で Prisma Client を再生成する場合
## 入力前提
- Docker Compose で DB コンテナが起動済み
## 実行手順
### Prisma Client 生成
```bash
make db-generate
# または
docker compose exec api sh -c "cd apps/api && npx prisma generate"
```
### マイグレーション
```bash
make db-migrate
# または
docker compose exec api sh -c "cd apps/api && npx prisma migrate dev --name describe-change"
```
### シードデータ投入
```bash
make db-seed
# または
docker compose exec api sh -c "cd apps/api && npx prisma db seed"
```
### DB リセット
```bash
make db-reset
# または
docker compose exec api sh -c "cd apps/api && npx prisma migrate reset --force"
```
### Prisma Studio (ローカルのみ)
```bash
make db-studio
# Docker 経由では直接ブラウザアクセスが必要なためローカル推奨
```
## 判断ルール
- スキーマ変更後は必ず `db-generate` → `db-migrate` の順で実行
- `db-reset` はデータが全削除されるため開発環境限定
## 出力形式
コマンド実行結果の確認
## 注意点
- Docker コンテナ内の Prisma とローカルの Prisma でバージョンを合わせる
- マイグレーションファイルは手動編集しない
## 失敗時の扱い
- マイグレーション競合: `prisma migrate resolve` で解決
- 接続エラー: DB コンテナの起動状態を確認（`docker compose ps`）
- ロック: `migration_lock.toml` を確認
