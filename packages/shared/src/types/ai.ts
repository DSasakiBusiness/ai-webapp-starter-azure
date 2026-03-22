// ============================================
// AI 関連共通型定義
// ============================================

/** チャットメッセージ */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/** チャットリクエスト */
export interface ChatRequest {
  messages: ChatMessage[];
  conversationId?: string;
}

/** チャットレスポンス */
export interface ChatResponse {
  content: string;
  model: string;
  usage: TokenUsage;
}

/** トークン使用量 */
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/** RAG ドキュメント */
export interface RagDocument {
  id: string;
  title: string;
  content: string;
  source?: string;
  chunks: RagChunk[];
}

/** RAG チャンク */
export interface RagChunk {
  id: string;
  content: string;
  score?: number;
  metadata?: Record<string, unknown>;
}

/** AI 評価結果 */
export interface AiEvalResult {
  testName: string;
  passed: boolean;
  score: number;
  expectedBehavior: string;
  actualBehavior: string;
  details?: Record<string, unknown>;
}
