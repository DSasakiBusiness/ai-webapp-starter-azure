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
          'api-key': this.configService.get<string>('AZURE_OPENAI_API_KEY'),
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

  async chat(messages: ChatMessage[]): Promise<ChatCompletionResult> {
    try {
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
    } catch (error) {
      this.logger.error('AI チャット呼び出しエラー', error);
      throw error;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.client.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      this.logger.error('埋め込み生成エラー', error);
      throw error;
    }
  }
}
