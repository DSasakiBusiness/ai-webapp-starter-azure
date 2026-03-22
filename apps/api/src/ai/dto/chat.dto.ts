import { IsArray, IsString, IsIn, ValidateNested, IsOptional, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * チャットメッセージ DTO
 * API リクエスト内の個別メッセージを表す。
 */
export class ChatMessageDto {
  @IsIn(['user', 'assistant', 'system'], {
    message: 'role は user, assistant, system のいずれかを指定してください',
  })
  role: 'user' | 'assistant' | 'system';

  @IsString()
  @MaxLength(32000, { message: 'メッセージは 32,000 文字以内で入力してください' })
  content: string;
}

/**
 * チャットリクエスト DTO
 * POST /api/ai/chat のリクエストボディ。
 */
export class ChatRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];

  @IsOptional()
  @IsString()
  conversationId?: string;
}
