---
name: implement-nestjs-api
description: NestJS でモジュール・コントローラー・サービスを実装する手順
---

# Implement NestJS API

## この skill を使う場面
- 新しい API エンドポイントを追加する場合
- 既存の API を修正する場合

## 入力前提
- API 契約が write-api-contract で定義済み
- Prisma スキーマが必要な場合は implement-prisma-schema で先に定義

## 実行手順

### Step 1: モジュール生成
```bash
cd apps/api
npx nest generate module modules/feature-name
npx nest generate controller modules/feature-name
npx nest generate service modules/feature-name
```

### Step 2: TDD で実装
1. Service のテストを先に書く (`*.spec.ts`)
2. テストが Red であることを確認
3. Service の最小実装で Green にする
4. Controller のテストを書く
5. Controller を実装
6. リファクタリング

### Step 3: DTO 定義
```typescript
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateFeatureDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

### Step 4: レスポンス形式統一
```typescript
return {
  success: true,
  data: result,
};
```

### Step 5: エラーハンドリング
- NestJS の組み込み例外を使用 (`NotFoundException`, `BadRequestException` 等)
- カスタムエラーは `HttpException` を拡張

## 判断ルール
- CRUD エンドポイントは REST 規約に従う (GET/POST/PUT/DELETE)
- 環境変数は `ConfigService` 経由で取得
- DB 操作は `PrismaService` 経由
- AI 関連は `AiService` 経由

## 出力形式
- `apps/api/src/modules/[name]/[name].module.ts`
- `apps/api/src/modules/[name]/[name].controller.ts`
- `apps/api/src/modules/[name]/[name].service.ts`
- `apps/api/src/modules/[name]/dto/[name].dto.ts`
- `apps/api/src/modules/[name]/[name].service.spec.ts`

## 注意点
- `any` 型は使用禁止（`unknown` + 型ガード）
- `console.log` は使用禁止（`Logger` を使用）
- AppModule に新しいモジュールを import すること

## 失敗時の扱い
- Prisma 接続エラー: DB コンテナの起動状態を確認
- バリデーションエラー: DTO のデコレータを見直す
