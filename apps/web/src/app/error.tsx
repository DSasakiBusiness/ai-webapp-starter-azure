'use client';

/**
 * Error Boundary
 * ランタイムエラー発生時にフォールバック UI を表示する。
 * Next.js App Router の規約ファイル。
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container">
      <div className="error-page">
        <h2>エラーが発生しました</h2>
        <p>{error.message || '予期しないエラーが発生しました。'}</p>
        <button onClick={reset} className="retry-button" id="error-reset-button">
          再試行
        </button>
      </div>
    </main>
  );
}
