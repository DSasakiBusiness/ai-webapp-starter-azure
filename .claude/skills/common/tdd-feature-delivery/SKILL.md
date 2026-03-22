---
name: tdd-feature-delivery
description: TDD (Red-Green-Refactor) サイクルで機能を実装する手順
---

# TDD Feature Delivery

## この skill を使う場面
- 新機能を TDD で実装する場合
- 既存機能を修正する場合

## 入力前提
- 受け入れ条件が定義済み (Given / When / Then)
- 対象のモジュール/ファイルが特定済み

## 実行手順

### Step 1: 受け入れ条件の確認
受け入れ条件をテストケースのリストに変換する:
```
受け入れ条件: ユーザーがメッセージを送信したら AI が応答を返す
→ テストケース 1: メッセージ送信時にレスポンスが返る
→ テストケース 2: レスポンスに content フィールドが含まれる
→ テストケース 3: エラー時にフォールバックメッセージが返る
```

### Step 2: Red - 失敗するテストを書く
```typescript
describe('AiService', () => {
  it('メッセージ送信時にレスポンスが返る', async () => {
    const result = await service.chat([{ role: 'user', content: 'テスト' }]);
    expect(result).toBeDefined();
    expect(result.content).toBeTruthy();
  });
});
```
テストを実行し、**Red (失敗)** であることを確認する。

### Step 3: Green - 最小実装で通す
テストを通す最小限のコードを書く。過剰な実装はしない。

### Step 4: Refactor - リファクタリング
テストが通ったまま、コードの品質を改善する:
- 命名の改善
- 重複の除去
- 設計パターンの適用

### Step 5: 次のテストケースへ
Step 2〜4 を繰り返し、全テストケースを実装する。

## 判断ルール
- テストが先。実装が先になることは絶対にない
- 最小実装で通す。「ついでに」の実装はしない
- リファクタリングは全テストが Green の状態でのみ行う
- AI 機能のテストは厳密文字一致ではなく構造でアサートする

## 出力形式
- テストファイル (`*.spec.ts` / `*.test.tsx`)
- 実装ファイル
- リファクタリング後のファイル

## 注意点
- テストを書く前に実装を始めない
- 一度に複数のテストケースを同時に Red にしない
- 外部依存はモックする（LLM API, DB等）

## 失敗時の扱い
- テストが書けない場合: 要件が不明確。clarify-product-requirements に戻る
- Green にできない場合: 設計を見直す。solution-architect に相談
- リファクタリングでテストが壊れた場合: 直前の状態に戻す
