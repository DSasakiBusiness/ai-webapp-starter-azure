---
name: design-azure-architecture
description: Azure 上のアーキテクチャ設計手順
---
# Design Azure Architecture
## この skill を使う場面
- Azure 上のインフラ構成を設計・変更する場合
## 入力前提
- アプリケーションの非機能要件 (可用性、スケーラビリティ、コスト) が定義済み
## 実行手順
### Step 1: 要件整理
- 想定トラフィック量
- 可用性要件 (99.9% 等)
- コスト上限
- データ保持要件
### Step 2: リソース構成設計
```
Azure Container Apps Environment
├── Container App: API (NestJS)
│   ├── min: 0 (staging) / 1 (production)
│   └── max: 1 (staging) / 3 (production)
├── Container App: Web (Next.js)
│   ├── min: 0 (staging) / 1 (production)
│   └── max: 1 (staging) / 3 (production)
├── Azure Container Registry (ACR) - Basic
├── PostgreSQL Flexible Server
│   ├── staging: Burstable B1ms
│   └── production: General Purpose D2s_v3
└── Log Analytics Workspace
```
### Step 3: ネットワーク設計
- Container Apps の ingress 設定
- PostgreSQL のファイアウォールルール
- 必要に応じて VNet 統合
### Step 4: コスト見積り
Azure Pricing Calculator で月額コストを見積り。
### Step 5: Bicep テンプレート更新
`infra/azure/bicep/main.bicep` を更新。
## 判断ルール
- スターターとして過度に複雑にしない
- staging と production でリソースサイズを分ける
- Burstable 系のインスタンスでコストを抑える
## 出力形式
アーキテクチャ設計書 (構成図 + リソース一覧 + コスト見積り)
## 注意点
- Azure 固有のロジックはこの skill と関連 agent に閉じ込める
## 失敗時の扱い
- コスト超過: リソースのダウンサイジングを検討
- パフォーマンス不足: スケールアップまたはスケールアウト設定を見直す
