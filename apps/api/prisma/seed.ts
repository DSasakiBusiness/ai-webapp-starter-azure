import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 シードデータの投入を開始...');

  // テスト用ユーザー作成
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '管理者ユーザー',
      role: 'ADMIN',
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'テストユーザー',
      role: 'USER',
    },
  });

  // サンプル会話作成
  const conversation = await prisma.conversation.create({
    data: {
      title: 'サンプル会話',
      userId: testUser.id,
      messages: {
        create: [
          {
            role: 'user',
            content: 'こんにちは、AIアシスタントさん。',
          },
          {
            role: 'assistant',
            content:
              'こんにちは！何かお手伝いできることはありますか？',
            metadata: {
              model: 'gpt-4o',
              tokens: { prompt: 15, completion: 20, total: 35 },
            },
          },
        ],
      },
    },
  });

  // サンプルドキュメント作成
  const document = await prisma.document.create({
    data: {
      title: 'サンプルドキュメント',
      content:
        'これはRAG機能のテスト用サンプルドキュメントです。AI Webアプリスターターの使い方について説明します。',
      source: 'manual',
      userId: adminUser.id,
      chunks: {
        create: [
          {
            content:
              'これはRAG機能のテスト用サンプルドキュメントです。',
            metadata: { position: 0, page: 1 },
          },
          {
            content:
              'AI Webアプリスターターの使い方について説明します。',
            metadata: { position: 1, page: 1 },
          },
        ],
      },
    },
  });

  console.log('✅ シードデータの投入完了');
  console.log({
    users: { admin: adminUser.id, test: testUser.id },
    conversation: conversation.id,
    document: document.id,
  });
}

main()
  .catch((e) => {
    console.error('❌ シードエラー:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
