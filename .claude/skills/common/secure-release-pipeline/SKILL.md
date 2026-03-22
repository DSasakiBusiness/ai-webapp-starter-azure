---
name: secure-release-pipeline
description: リリース前のセキュリティチェックを含む安全なリリースパイプラインの手順
---
# Secure Release Pipeline
## この skill を使う場面
- 本番リリース前の最終チェック
## 入力前提
- 全テスト (unit, integration, E2E) が通過済み
- PentAGI セキュリティレビュー完了
## 実行手順
### Step 1: セキュリティチェックリスト
- [ ] Secrets がハードコードされていない
- [ ] 依存パッケージに既知の脆弱性がない (`npm audit`)
- [ ] API 入力バリデーションが実装済み
- [ ] CORS 設定が適切
- [ ] HTTP セキュリティヘッダーが設定済み
- [ ] PentAGI レビュー済み (ステージング)
### Step 2: 品質チェック
- [ ] 全テストが CI で通過済み
- [ ] コードレビュー完了
- [ ] ドキュメント更新済み
### Step 3: リリース判定
Critical/High のセキュリティ指摘が 0 件であることを確認。
### Step 4: タグ付けとリリース
```bash
git tag v[version]
git push origin v[version]
```
## 判断ルール
- Critical/High が 1 件でもあればリリースをブロック
- `npm audit` の high 以上は修正必須
## 出力形式
リリース判定レポート
## 注意点
- チェックリストの省略は禁止
## 失敗時の扱い
- セキュリティ問題が見つかった場合: 修正して再チェック
