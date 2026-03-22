---
name: monitor-on-azure
description: Azure Monitor / Log Analytics を使ったアプリケーション監視の構築手順
---
# Monitor on Azure
## この skill を使う場面
- 本番環境の監視を設定する場合
- アプリケーションの問題を診断する場合
## 入力前提
- Azure リソースがデプロイ済み
- Log Analytics Workspace が構成済み (Bicep テンプレートに含まれる)
## 実行手順
### Step 1: ログ確認
```bash
RESOURCE_GROUP=rg-aiwebapp-production
APP_NAME=aiwebapp-production-api
# Container Apps のログ確認
az containerapp logs show --name $APP_NAME --resource-group $RESOURCE_GROUP --follow
# Log Analytics クエリ
az monitor log-analytics query --workspace <workspace-id> \
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s == 'aiwebapp-production-api' | top 50 by TimeGenerated"
```
### Step 2: アラートルール設定
```bash
# CPU 使用率アラート
az monitor metrics alert create --name "high-cpu" \
  --resource-group $RESOURCE_GROUP \
  --scopes <container-app-resource-id> \
  --condition "avg Percentage Memory > 80" \
  --action <action-group-id>
# エラーレートアラート (Log Analytics)
# Log Analytics でカスタムクエリアラートを作成
```
### Step 3: 推奨アラート一覧
| アラート名 | 条件 | 重要度 |
|-----------|------|--------|
| high-cpu | CPU > 80% (5分平均) | Warning |
| high-memory | Memory > 80% (5分平均) | Warning |
| api-errors | 5xx エラー > 10/分 | Critical |
| db-connection-fail | DB 接続失敗 | Critical |
| ai-api-errors | LLM API エラー > 5/分 | High |
### Step 4: ダッシュボード設定
Azure Portal でカスタムダッシュボードを作成:
- コンテナのリソース使用率
- API レスポンスタイム
- エラーレート
- DB 接続数
## 判断ルール
- Critical アラートは即対応 (PagerDuty / Slack 通知)
- Warning アラートは翌営業日対応
- ログの保持期間は 30 日 (コスト最適化)
## 出力形式
監視設定完了レポート (アラートルール一覧 + ダッシュボード URL)
## 注意点
- ログにSecrets が出力されないようアプリケーション側で対策する
- LLM API のレスポンスタイムは通常の API より長いため、タイムアウト設定を分ける
## 失敗時の扱い
- アラートが過剰に発火: 閾値を見直す
- ログが取得できない: Log Analytics Workspace の設定と Container Apps のログ設定を確認
