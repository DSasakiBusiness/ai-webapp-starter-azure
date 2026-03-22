---
name: deploy-to-azure
description: Azure Container Apps へのデプロイ手順
---
# Deploy to Azure
## この skill を使う場面
- 手動で Azure にデプロイする場合
- デプロイスクリプトのトラブルシューティング
## 入力前提
- Azure CLI (`az`) がインストール済み
- `az login` でログイン済み
- ACR にイメージがプッシュ可能
## 実行手順
### Step 1: Azure ログイン
```bash
az login
az account set --subscription "your-subscription-id"
```
### Step 2: ACR ログイン・イメージビルド
```bash
ACR_NAME=aiwebappstaging
az acr login --name $ACR_NAME
# API
docker build -f apps/api/Dockerfile -t $ACR_NAME.azurecr.io/ai-webapp-api:latest .
docker push $ACR_NAME.azurecr.io/ai-webapp-api:latest
# Web
docker build -f apps/web/Dockerfile -t $ACR_NAME.azurecr.io/ai-webapp-web:latest .
docker push $ACR_NAME.azurecr.io/ai-webapp-web:latest
```
### Step 3: リソースデプロイ (初回)
```bash
cd infra/azure
./scripts/deploy.sh staging
```
### Step 4: アプリ更新 (2回目以降)
```bash
RESOURCE_GROUP=rg-aiwebapp-staging
az containerapp update --name aiwebapp-staging-api --resource-group $RESOURCE_GROUP --image $ACR_NAME.azurecr.io/ai-webapp-api:latest
az containerapp update --name aiwebapp-staging-web --resource-group $RESOURCE_GROUP --image $ACR_NAME.azurecr.io/ai-webapp-web:latest
```
### Step 5: DB マイグレーション
```bash
az containerapp exec --name aiwebapp-staging-api --resource-group $RESOURCE_GROUP --command "npx prisma migrate deploy"
```
### Step 6: 動作確認
デプロイ後の URL にアクセスし、ヘルスチェックを実行。
## 判断ルール
- 通常は CI/CD (GitHub Actions) 経由でデプロイする
- 手動デプロイは緊急時またはデバッグ時のみ
## 出力形式
デプロイ完了確認 (URL + ヘルスチェック結果)
## 注意点
- Secrets を `az containerapp update --set-env-vars` で設定する場合はログに残らないよう注意
## 失敗時の扱い
- デプロイ失敗: `az containerapp revision list` で前のリビジョンを確認し、ロールバック
- イメージプッシュ失敗: ACR のクォータと認証を確認
