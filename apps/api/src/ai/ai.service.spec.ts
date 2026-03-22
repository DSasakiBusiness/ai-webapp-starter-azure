import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AiService, ChatMessage, ChatCompletionResult } from './ai.service';

// OpenAI SDK をモック
jest.mock('openai', () => {
  const mockCreate = jest.fn();
  const mockEmbeddingsCreate = jest.fn();
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
      embeddings: {
        create: mockEmbeddingsCreate,
      },
    })),
    _mockCreate: mockCreate,
    _mockEmbeddingsCreate: mockEmbeddingsCreate,
  };
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { _mockCreate, _mockEmbeddingsCreate } = require('openai');

describe('AiService', () => {
  let service: AiService;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: string) => {
      const config: Record<string, string> = {
        OPENAI_API_KEY: 'test-key',
        OPENAI_MODEL: 'gpt-4o-mini',
      };
      return config[key] || defaultValue || '';
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  describe('chat', () => {
    const testMessages: ChatMessage[] = [
      { role: 'user', content: 'テストメッセージ' },
    ];

    it('正常なレスポンスを返す', async () => {
      _mockCreate.mockResolvedValue({
        choices: [
          {
            message: { content: 'AI の応答です' },
          },
        ],
        model: 'gpt-4o-mini',
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      });

      const result: ChatCompletionResult = await service.chat(testMessages);

      expect(result.content).toBe('AI の応答です');
      expect(result.model).toBe('gpt-4o-mini');
      expect(result.usage.promptTokens).toBe(10);
      expect(result.usage.completionTokens).toBe(20);
      expect(result.usage.totalTokens).toBe(30);
    });

    it('空のレスポンスでエラーを投げる', async () => {
      _mockCreate.mockResolvedValue({
        choices: [
          {
            message: { content: null },
          },
        ],
        model: 'gpt-4o-mini',
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      });

      await expect(service.chat(testMessages)).rejects.toThrow(
        'AI からの応答が空です',
      );
    });

    it('リトライ対象外のエラーは即座に投げる', async () => {
      _mockCreate.mockRejectedValue(new Error('Invalid API key'));

      await expect(service.chat(testMessages)).rejects.toThrow(
        'Invalid API key',
      );

      // リトライなしで 1 回だけ呼ばれる
      expect(_mockCreate).toHaveBeenCalledTimes(1);
    });

    it('レート制限エラーはリトライする', async () => {
      _mockCreate
        .mockRejectedValueOnce(new Error('429 Rate limit exceeded'))
        .mockResolvedValue({
          choices: [{ message: { content: 'リトライ成功' } }],
          model: 'gpt-4o-mini',
          usage: { prompt_tokens: 5, completion_tokens: 5, total_tokens: 10 },
        });

      const result = await service.chat(testMessages);

      expect(result.content).toBe('リトライ成功');
      expect(_mockCreate).toHaveBeenCalledTimes(2);
    }, 15000);
  });

  describe('generateEmbedding', () => {
    it('埋め込みベクトルを返す', async () => {
      const mockEmbedding = [0.1, 0.2, 0.3, 0.4, 0.5];
      _mockEmbeddingsCreate.mockResolvedValue({
        data: [{ embedding: mockEmbedding }],
      });

      const result = await service.generateEmbedding('テスト文');

      expect(result).toEqual(mockEmbedding);
      expect(result).toHaveLength(5);
    });
  });
});
