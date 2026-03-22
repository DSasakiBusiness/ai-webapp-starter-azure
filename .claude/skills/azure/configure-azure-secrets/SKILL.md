---
name: configure-azure-secrets
description: Azure Key Vault / Container Apps Secrets の設定手順
---
# Configure Azure Secrets
## この skill を使う場面
- Secrets (API キー、DB パスワード等) を安全に管理する場合
## 入力前提
- Azure リソースがデプロイ済み
- 管理すべき Secrets のリストが特定済み
## 実行手順
### 方法 A: Container Apps Secrets (シンプル)
```bash
RESOURCE_GROUP=rg-aiwebapp-staging
APP_NAME=aiwebapp-staging-api
# Secret の設定
az containerapp secret set --name $APP_NAME --resource-group $RESOURCE_GROUP \
  --secrets "openai-api-key=sk-xxxx" "db-password=xxxx"
# 環境変数に Secret を紐付け
az containerapp update --name $APP_NAME --resource-group $RESOURCE_GROUP \
  --set-env-vars "OPENAI_API_KEY=secretref:openai-api-key" "DB_PASSWORD=secretref:db-password"
```
### 方法 B: Azure Key Vault (エンタープライズ)
```bash
# Key Vault 作成
az keyvault create --name aiwebapp-kv --resource-group $RESOURCE_GROUP --location japaneast
# Secret の設定
az keyvault secret set --vault-name aiwebapp-kv --name "openai-api-key" --value "sk-xxxx"
# マネージド ID でアクセス
az containerapp identity assign --name $APP_NAME --resource-group $RESOURCE_GROUP --system-assigned
# Key Vault のアクセスポリシー設定
az keyvault set-policy --name aiwebapp-kv --object-id <managed-identity-id> --secret-permissions get list
```
### Secrets 一覧 (管理対象)
| Secret 名 | 用途 | 使用サービス |
|-----------|------|-------------|
| database-url | DB 接続文字列 | API |
| openai-api-key | OpenAI API キー | API |
| azure-openai-api-key | Azure OpenAI API キー | API |
| nextauth-secret | NextAuth 暗号化キー | Web |
## 判断ルール
- スターター段階では Container Apps Secrets で十分
- エンタープライズ要件がある場合は Key Vault を使用
- Secrets のローテーションは 90 日ごと
## 出力形式
Secrets 設定完了確認 + 管理対象一覧
## 注意点
- Secrets を Git にコミットしない
- `az` コマンドのヒストリに Secrets が残る場合がある（`--value @file` で回避）
## 失敗時の扱い
- Secret 漏洩の疑い: 即座にローテーションし、影響範囲を調査
- アクセス拒否: マネージド ID と Key Vault ポリシーを確認
