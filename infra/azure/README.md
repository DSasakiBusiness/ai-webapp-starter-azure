# Azure インフラストラクチャ

## 構成概要

```
Azure Container Apps Environment
├── Container App: API (NestJS)
├── Container App: Web (Next.js)
├── Azure Container Registry (ACR)
├── PostgreSQL Flexible Server
└── Log Analytics Workspace
```

## ファイル構成
- `bicep/main.bicep` - メインテンプレート（全リソース定義）
- `scripts/deploy.sh` - デプロイスクリプト

## デプロイ方法

### 前提条件
- Azure CLI がインストール済み
- `az login` でログイン済み
- 適切なサブスクリプションが選択済み

### ステージング
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh staging
```

### 本番
```bash
./scripts/deploy.sh production
```

## セキュリティ注意事項
- `main.bicep` 内の `REPLACE_WITH_SECURE_PASSWORD` は必ず安全なパスワードに置き換えること
- 本番運用では Azure Key Vault でパスワードを管理すること
- API キーは Container Apps の Secrets 機能を使用すること
