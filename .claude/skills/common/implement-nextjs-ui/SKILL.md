---
name: implement-nextjs-ui
description: Next.js App Router でページ・コンポーネントを実装する手順
---

# Implement Next.js UI

## この skill を使う場面
- 新しいページを追加する場合
- UI コンポーネントを作成・修正する場合

## 入力前提
- 要件と受け入れ条件が定義済み
- API エンドポイントの仕様が確定済み（write-api-contract で定義）

## 実行手順

### Step 1: ページ/コンポーネント構造の設計
- App Router のルーティングに基づいてファイル配置を決定
- `page.tsx` (ページ), `layout.tsx` (レイアウト), コンポーネントの分離を判断

### Step 2: TDD で実装
1. テストファイルを先に作成 (`*.test.tsx`)
2. テストが Red であることを確認
3. 最小実装で Green にする
4. リファクタリング

### Step 3: API 連携
- `src/lib/api-client.ts` の `apiClient` を使用
- ローディング・エラー・空状態の UI を実装
- エラー時の再試行ボタンを提供

### Step 4: スタイリング
- Vanilla CSS を使用 (`globals.css` またはコンポーネント CSS)
- CSS 変数 (`var(--color-*)`) を活用
- レスポンシブデザインを考慮

### Step 5: E2E テスト用属性の付与
- インタラクティブな要素に id 属性を付与
- role 属性を適切に設定

## 判断ルール
- サーバーコンポーネントでは `'use client'` を付けない
- `useState`, `useEffect` 等を使う場合のみ `'use client'` を付ける
- `packages/shared` の型定義を使用する

## 出力形式
- `apps/web/src/app/[path]/page.tsx` (ページ)
- `apps/web/src/components/[name].tsx` (コンポーネント)
- `apps/web/src/app/globals.css` にスタイル追加

## 注意点
- Next.js のハイドレーションエラーに注意（日付、ランダム値等）
- 画像は `next/image` を使用
- リンクは `next/link` を使用

## 失敗時の扱い
- ハイドレーションエラー: `'use client'` の配置を見直す
- API 呼び出し失敗: エラーバウンダリとフォールバック UI を実装
