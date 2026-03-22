import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Web App Starter',
  description: 'AI 特化 Web サービス開発スターター',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
