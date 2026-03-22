'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
    { role: string; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error(`API エラー: ${response.status}`);
      }

      const data = await response.json();
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: data.data.content },
      ]);
    } catch (error) {
      console.error('通信エラー:', error);
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
  };

  return (
    <main className="container">
      <header className="header">
        <h1>AI Web App Starter</h1>
        <p>AI 特化 Web サービス開発スターター</p>
      </header>

      <div className="chat-container">
        <div className="messages">
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

        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            disabled={loading}
            className="input-field"
            id="chat-input"
          />
          <button type="submit" disabled={loading || !input.trim()} className="send-button" id="send-button">
            送信
          </button>
        </form>
      </div>
    </main>
  );
}
