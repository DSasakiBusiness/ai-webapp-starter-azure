---
name: setup-pentagi-scan
description: PentAGI のスキャン環境を初期セットアップする手順
---
# Setup PentAGI Scan
## この skill を使う場面
- PentAGI を初めて導入する場合
- スキャン環境を再構築する場合
## 入力前提
- Docker が利用可能
- ステージング環境がデプロイ済み
## ⚠️ 安全上の注意
- PentAGI は隔離された Docker 環境で実行する
- 本番ネットワークから分離されていることを確認する
## 実行手順
### Step 1: 環境変数設定
```bash
PENTAGI_API_URL=http://localhost:8080
PENTAGI_API_KEY=your-api-key
PENTAGI_TARGET_URL=https://staging.example.com  # ステージングのみ
```
### Step 2: PentAGI コンテナ起動
PentAGI のドキュメントに従って Docker 環境で起動。
### Step 3: 接続テスト
PentAGI API にヘルスチェックリクエストを送信し、正常応答を確認。
### Step 4: スキャン設定の準備
対象 URL、スキャン範囲、除外パスを設定ファイルに定義。
## 判断ルール
- 対象 URL が本番でないことを二重確認
- PentAGI の Docker ネットワークが本番と分離されていることを確認
## 出力形式
セットアップ完了確認 + 接続テスト結果
## 注意点
- PentAGI の API キーを Git にコミットしない
## 失敗時の扱い
- Docker 起動エラー: ポート競合やリソース不足を確認
- 接続エラー: ネットワーク設定を確認
