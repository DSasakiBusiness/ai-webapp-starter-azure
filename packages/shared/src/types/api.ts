// ============================================
// API 共通型定義
// ============================================

/** API レスポンスの共通ラッパー */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: ApiError;
}

/** API エラー */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/** ページネーション付きレスポンス */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** ページネーションリクエスト */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** ヘルスチェックレスポンス */
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  database: 'connected' | 'disconnected';
  error?: string;
}
