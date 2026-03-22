#!/usr/bin/env bash
# ============================================
# Azure デプロイスクリプト
# ============================================
# 使用方法: ./deploy.sh <environment>
# 例: ./deploy.sh staging

set -euo pipefail

ENVIRONMENT="${1:-staging}"
PROJECT_NAME="aiwebapp"
LOCATION="japaneast"
RESOURCE_GROUP="rg-${PROJECT_NAME}-${ENVIRONMENT}"

echo "=========================================="
echo "Azure デプロイ: ${ENVIRONMENT}"
echo "=========================================="

# リソースグループ作成
echo "📦 リソースグループ作成..."
az group create \
  --name "${RESOURCE_GROUP}" \
  --location "${LOCATION}" \
  --tags environment="${ENVIRONMENT}" project="${PROJECT_NAME}"

# Bicep デプロイ
echo "🚀 Bicep テンプレートのデプロイ..."
az deployment group create \
  --resource-group "${RESOURCE_GROUP}" \
  --template-file "$(dirname "$0")/../bicep/main.bicep" \
  --parameters \
    environment="${ENVIRONMENT}" \
    projectName="${PROJECT_NAME}" \
    location="${LOCATION}"

# デプロイ結果の表示
echo ""
echo "=========================================="
echo "✅ デプロイ完了"
echo "=========================================="
az deployment group show \
  --resource-group "${RESOURCE_GROUP}" \
  --name main \
  --query properties.outputs \
  --output table

echo ""
echo "⚠️  注意事項:"
echo "  1. PostgreSQL のパスワードを Azure Key Vault に移行してください"
echo "  2. カスタムドメインの設定を行ってください"
echo "  3. SSL 証明書の設定を確認してください"
echo "  4. 環境変数（APIキー等）を Container Apps の Secrets に設定してください"
