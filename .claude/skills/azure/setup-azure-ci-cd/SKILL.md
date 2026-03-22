---
name: setup-azure-ci-cd
description: GitHub Actions を使った Azure CI/CD パイプラインの構築手順
---
# Setup Azure CI/CD
## この skill を使う場面
- CI/CD パイプラインを新規構築する場合
- パイプラインのトラブルシューティング
## 入力前提
- GitHub リポジトリが存在
- Azure リソースがデプロイ済み
## 実行手順
### Step 1: Azure サービスプリンシパル作成
```bash
az ad sp create-for-rbac --name "github-deployer" --role contributor \
  --scopes /subscriptions/{sub-id}/resourceGroups/{rg-name} \
  --json-auth
```
出力された JSON を GitHub Secrets の `AZURE_CREDENTIALS` に設定。
### Step 2: GitHub Secrets 設定
リポジトリの Settings → Secrets and variables → Actions:
- `AZURE_CREDENTIALS` - サービスプリンシパルの JSON
### Step 3: ワークフロー確認
- `.github/workflows/ci.yml` - PR / push 時のテスト
- `.github/workflows/cd-staging.yml` - develop ブランチ → ステージング
- `.github/workflows/cd-production.yml` - v* タグ → 本番
### Step 4: テスト実行
develop ブランチに push してステージングデプロイが動作することを確認。
## 判断ルール
- staging はプッシュ時に自動デプロイ
- production はタグ + 手動承認
## 出力形式
CI/CD セットアップ完了確認
## 注意点
- サービスプリンシパルの権限は最小限にする
- Secrets のローテーションを定期的に行う
## 失敗時の扱い
- 認証エラー: `AZURE_CREDENTIALS` の有効期限を確認
- デプロイ失敗: ワークフローログを確認
