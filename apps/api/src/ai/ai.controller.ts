import { Controller, Post, Body, Get } from '@nestjs/common';
import { AiService, ChatMessage } from './ai.service';
import { IsArray, IsString, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ChatMessageDto {
  @IsIn(['user', 'assistant', 'system'])
  role: 'user' | 'assistant' | 'system';

  @IsString()
  content: string;
}

class ChatRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];
}

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('status')
  getStatus() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('chat')
  async chat(@Body() dto: ChatRequestDto) {
    const result = await this.aiService.chat(dto.messages as ChatMessage[]);
    return {
      success: true,
      data: result,
    };
  }
}
