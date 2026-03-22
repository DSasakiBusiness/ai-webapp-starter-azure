import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionResult {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/** リトライ設定 */
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
} as const;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const azureEndpoint = this.configService.get<string>(
      'AZURE_OPENAI_ENDPOINT',
    );

    if (azureEndpoint) {
      // Azure OpenAI 経由
      this.client = new OpenAI({
        apiKey: this.configService.get<string>('AZURE_OPENAI_API_KEY'),
        baseURL: `${azureEndpoint}/openai/deployments/${this.configService.get<string>('AZURE_OPENAI_DEPLOYMENT')}`,
        defaultQuery: {
          'api-version':
            this.configService.get<string>('AZURE_OPENAI_API_VERSION') ||
            '2024-08-01-preview',
        },
        defaultHeaders: {
          'api-key':
            this.configService.get<string>('AZURE_OPENAI_API_KEY') || '',
        },
      });
      this.model =
        this.configService.get<string>('AZURE_OPENAI_DEPLOYMENT') || 'gpt-4o';
      this.logger.log('Azure OpenAI クライアント初期化完了');
    } else {
      // OpenAI 直接
      this.client = new OpenAI({
        apiKey: this.configService.get<string>('OPENAI_API_KEY'),
      });
      this.model = this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o';
      this.logger.log('OpenAI クライアント初期化完了');
    }
  }

  /**
   * チャット補完を実行する
   * 指数バックオフ付きリトライで LLM API を呼び出す。
   * CLAUDE.md / ai-engineer の規定に準拠。
   */
  async chat(messages: ChatMessage[]): Promise<ChatCompletionResult> {
    return this.withRetry(() => this.executeChatCompletion(messages));
  }

  /**
   * テキストの埋め込みベクトルを生成する
   */
  async generateEmbedding(text: string): Promise<number[]> {
    return this.withRetry(async () => {
      const response = await this.client.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return response.data[0].embedding;
    });
  }

  /**
   * チャット補完の実行本体
   */
  private async executeChatCompletion(
    messages: ChatMessage[],
  ): Promise<ChatCompletionResult> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      temperature: 0.7,
      max_tokens: 2048,
    });

    const choice = response.choices[0];
    if (!choice || !choice.message.content) {
      throw new Error('AI からの応答が空です');
    }

    return {
      content: choice.message.content,
      model: response.model,
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
    };
  }

  /**
   * 指数バックオフ付きリトライ
   * 最大 3 回リトライ。429 (レート制限) と 5xx はリトライ対象。
   */
  private async withRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt === RETRY_CONFIG.maxRetries) {
          break;
        }

        // レート制限 or サーバーエラーのみリトライ
        if (!this.isRetryableError(error)) {
          break;
        }

        const delay = Math.min(
          RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt),
          RETRY_CONFIG.maxDelayMs,
        );

        this.logger.warn(
          `AI API リトライ ${attempt + 1}/${RETRY_CONFIG.maxRetries} (${delay}ms 後)`,
        );

        await this.sleep(delay);
      }
    }

    this.logger.error('AI API 呼び出し失敗 (リトライ上限到達)', lastError?.stack);
    throw lastError;
  }

  /**
   * リトライ対象のエラーかどうかを判定する
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      // 429 (レート制限) or 5xx (サーバーエラー) or ネットワークエラー
      return (
        message.includes('429') ||
        message.includes('rate limit') ||
        message.includes('500') ||
        message.includes('502') ||
        message.includes('503') ||
        message.includes('504') ||
        message.includes('timeout') ||
        message.includes('econnreset') ||
        message.includes('econnrefused')
      );
    }
    return false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
