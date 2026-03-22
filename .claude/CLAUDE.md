# CLAUDE.md - ai-webapp-starter-azure プロジェクト横断ルール

## リポジトリの目的
AI 特化 Web サービスの開発スターター。Next.js + NestJS + Prisma + LLM 統合を軸に、Docker ベースのローカル開発から Azure 配備までを一気通貫で提供する。

## 技術スタック
- **フロントエンド**: Next.js 15 (App Router), React 19, TypeScript
- **バックエンド**: NestJS 10, TypeScript
- **ORM**: Prisma 5 (PostgreSQL 16)
- **AI/LLM**: OpenAI SDK, Azure OpenAI
- **テスト**: Jest (unit/integration), Playwright (E2E)
- **CI/CD**: GitHub Actions
- **コンテナ**: Docker / Docker Compose
- **クラウド**: Azure Container Apps, ACR, PostgreSQL Flexible Server
- **モノレポ**: npm workspaces, Turborepo

## Agent の使い分け

Agent は「判断主体」。いつ何を行うか、何を委譲するかを決める存在。

| Agent | いつ使う |
|-------|---------|
| product-manager | 要件が曖昧、MVP を絞りたい、優先度を決めたい |
| solution-architect | 全体構成の判断、非機能要件、責務境界の判断が必要 |
| frontend-developer | Next.js の UI 実装、コンポーネント設計 |
| backend-developer | NestJS の API 実装、DB 設計、Prisma スキーマ変更 |
| ai-engineer | LLM 統合、RAG パイプライン、プロンプト設計、AI 品質評価 |
| qa-reviewer | コード品質、テスト網羅性、非機能品質のレビュー |
| tdd-coach | 実装着手前のテスト設計、Red-Green-Refactor の強制 |
| e2e-tester | Playwright テスト設計、ユーザーフロー検証 |
| security-reviewer | PentAGI を使ったセキュリティ検証（ステージング限定） |
| azure-platform-engineer | Azure 固有の設計・デプロイ・Secrets・監視 |

## TDD の原則

### 必須サイクル
1. **受け入れ条件を定義**: 何をもって「完了」とするかを先に決める
2. **失敗するテストを書く** (Red): テストが実装前に失敗することを確認
3. **最小実装で通す** (Green): テストを通す最小限のコードを書く
4. **リファクタリング** (Refactor): テストが通ったままコードを改善

### テスト種別と責務
| 種別 | 責務 | 実行速度 | 外部依存 |
|------|------|----------|----------|
| unit | 純粋ロジック、単一関数/クラス | 高速 | モック |
| integration | モジュール間連携、DB 操作 | 中速 | テスト DB |
| E2E | ユーザーフロー全体 | 低速 | 全サービス |

### AI 機能のテスト方針
- 厳密な文字一致で評価しない
- 構造（JSON 形式、必須フィールドの存在）で評価する
- 失敗時の表示、再試行、タイムアウト動作をテストする
- 引用の正確性は抽出と照合で検証する
- 境界条件（空入力、超長文、多言語）をテストする

## Unit / Integration / E2E の使い分け

### Unit テストで書くもの
- ビジネスロジック
- ユーティリティ関数
- バリデーションロジック
- 型変換、データ整形

### Integration テストで書くもの
- API エンドポイントの入出力
- Prisma 経由の DB 操作
- 認証・認可フロー
- AI サービスとの統合（モック可）

### E2E テストで書くもの
- ユーザーの主要操作フロー
- 認証 → 操作 → 結果確認の一連の流れ
- エラー時のフォールバック表示
- 再試行の導線

## AI 機能の評価方針

- **構造評価**: レスポンスに必要なフィールドがあるか
- **失敗時動作**: API エラー時にユーザーに適切なメッセージを表示するか
- **引用検証**: RAG 使用時に引用元が正しいか
- **再試行**: タイムアウトやエラー時にリトライ機構が機能するか
- **境界条件**: 空入力、超長文、特殊文字、多言語での動作
- **評価データ**: 固定の評価データセットでテストし、回帰を検出する

## PentAGI の位置づけ

- security-reviewer が使う**検証ツール**であり、開発 agent そのものではない
- **本番環境に対して実行禁止**
- ステージングまたは隔離環境限定
- テスト対象: API、認証、入力バリデーション、ファイルアップロード、セッション、LLM 特有の攻撃面
- 結果は critical / high / medium / low で分類
- **必ず人間が再確認**してから修正に着手

## Docker 開発の原則

- ローカル開発は Docker / Docker Compose 前提
- `make dev` で web + api + db が起動する
- Prisma の migrate / generate / seed は Docker 経由でも実行可能
- 開発用 Dockerfile (`Dockerfile.dev`) と本番用 Dockerfile (`Dockerfile`) を分離
- ホットリロードが効く構成にする
- テスト実行も Docker 前提のコマンドを用意する

## Azure 固有の注意点

- Azure 固有のロジックは `azure-platform-engineer` agent と `azure/*` skills に閉じ込める
- 共通コードに Azure 固有の条件分岐を入れない
- Secrets は Azure Key Vault または Container Apps の Secrets で管理する
- デプロイは Container Apps 前提（Bicep テンプレートで定義済み）
- CI/CD は GitHub Actions から Azure CLI 経由

## PR 時の確認観点

1. **テスト**: unit / integration テストが追加・更新されているか
2. **TDD**: 受け入れ条件が先に定義されているか
3. **型安全**: `any` 型の使用がないか
4. **バリデーション**: API 入力のバリデーションが追加されているか
5. **セキュリティ**: 秘密情報がハードコードされていないか
6. **Docker**: docker-compose.yml との整合性があるか
7. **マイグレーション**: Prisma スキーマ変更時にマイグレーションファイルがあるか
8. **ドキュメント**: README やドキュメントが更新されているか

## 実装時の禁止事項

- `any` 型の使用（`unknown` + 型ガードを使う）
- `console.log` のコミット（NestJS の Logger を使う）
- 秘密情報のハードコード
- テストなしの機能追加
- `TODO` コメントの放置（Issue に起票する）
- 環境変数の直接参照（ConfigService 経由で取得する）
- Prisma の raw SQL（やむを得ない場合は理由をコメントで明記）

## Claude に依頼するときのルール

1. **機能追加の依頼**: まず product-manager に要件を整理させる
2. **設計の依頼**: solution-architect に全体影響を確認させる
3. **実装の依頼**: 対応する developer agent に依頼し、tdd-coach にテスト先行を強制させる
4. **レビューの依頼**: qa-reviewer にコード品質を確認させる
5. **セキュリティ確認**: security-reviewer にステージング環境でレビューさせる
6. **Azure 運用**: azure-platform-engineer に一任する

## 既存設計を壊さないための原則

1. **既存テストを壊さない**: 変更前に全テストが通ることを確認
2. **スキーマ変更は互換性を保つ**: 破壊的変更は migration で段階的に行う
3. **API 契約を守る**: 既存エンドポイントの変更は非推奨期間を設ける
4. **共有型を勝手に変更しない**: `packages/shared` の型変更は影響範囲を確認
5. **Docker 構成を壊さない**: `make dev` で正常起動することを確認
6. **Agent/Skill の責務を侵さない**: 新しい責務は新しい Agent/Skill として追加
