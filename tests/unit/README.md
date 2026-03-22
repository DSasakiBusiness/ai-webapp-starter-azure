# ユニットテスト

## 方針
- 純粋なロジックとサービス層のテストを行う
- 外部依存（DB、API）はモックする
- ファイル命名: `*.spec.ts`
- カバレッジ目標: 80% 以上

## 実行方法
```bash
# ローカル
npm run test:unit

# Docker
make test-unit
```

## ディレクトリ構成
テストファイルはソースコードと同じディレクトリに配置する（co-location パターン）。
このディレクトリはプロジェクト全体のテスト方針を記載する場所として使用する。

例:
- `apps/api/src/app.service.spec.ts`
- `apps/web/src/components/Button.test.tsx`
