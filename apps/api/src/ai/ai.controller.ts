import { Controller, Post, Body, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatRequestDto } from './dto/chat.dto';

/**
 * AI コントローラー
 * LLM 関連のエンドポイントを提供する。
 */
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * AI サービスのステータスを返す
   */
  @Get('status')
  getStatus() {
    return {
      success: true,
      data: {
        status: 'ready',
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * チャット補完を実行する
   * リトライ付きで LLM API を呼び出し、統一フォーマットで返却する。
   */
  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async chat(@Body() dto: ChatRequestDto) {
    const result = await this.aiService.chat(dto.messages);
    return {
      success: true,
      data: result,
    };
  }
}
