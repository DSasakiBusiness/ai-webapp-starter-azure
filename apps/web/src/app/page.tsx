'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponseData {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || loading) return;

      const userMessage: Message = { role: 'user', content: input };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput('');
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.post<ChatResponseData>('/ai/chat', {
          messages: updatedMessages,
        });

        setMessages([
          ...updatedMessages,
          { role: 'assistant', content: response.data.content },
        ]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '通信エラーが発生しました';
        setError(errorMessage);
        setMessages([
          ...updatedMessages,
          {
            role: 'assistant',
            content:
              '申し訳ございません。通信エラーが発生しました。しばらくしてから再度お試しください。',
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages],
  );

  const handleRetry = useCallback(() => {
    setError(null);
    // 最後のアシスタントメッセージ (エラーメッセージ) を除去して再送信
    const withoutLastAssistant = messages.slice(0, -1);
    setMessages(withoutLastAssistant);
    if (withoutLastAssistant.length > 0) {
      const lastUserMessage = withoutLastAssistant[withoutLastAssistant.length - 1];
      if (lastUserMessage.role === 'user') {
        setInput(lastUserMessage.content);
      }
    }
  }, [messages]);

  return (
    <main className="container">
      <header className="header">
        <h1>AI Web App Starter</h1>
        <p>AI 特化 Web サービス開発スターター</p>
      </header>

      <div className="chat-container">
        <div className="messages" id="messages-container" role="log">
          {messages.length === 0 && (
            <div className="empty-state">
              <p>メッセージを入力して AI と会話を始めましょう</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`message message-${msg.role}`}>
              <div className="message-role">
                {msg.role === 'user' ? 'あなた' : 'AI'}
              </div>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}
          {loading && (
            <div className="message message-assistant">
              <div className="message-role">AI</div>
              <div className="message-content loading-dots">考え中...</div>
            </div>
          )}
        </div>

        {error && (
          <div className="error-banner" role="alert" id="error-banner">
            <span>{error}</span>
            <button
              onClick={handleRetry}
              className="retry-button"
              id="retry-button"
              type="button"
            >
              再試行
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            disabled={loading}
            className="input-field"
            id="chat-input"
            aria-label="チャットメッセージ入力"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="send-button"
            id="send-button"
          >
            送信
          </button>
        </form>
      </div>
    </main>
  );
}
