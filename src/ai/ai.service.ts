import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { getRequiredEnv } from '../common/utils/env.util';
import { MessageRole } from './enums/message-role.enum';
import { AIContext, AIResponse } from './types/ai.types';

const MAX_OUTPUT_TOKENS = 2000;
const TEMPERATURE = 0.7;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly apiKey: string;
  private readonly model: string;
  private readonly client: OpenAI;

  constructor(private configService: ConfigService) {
    this.apiKey = getRequiredEnv(this.configService, 'OPENAI_API_KEY');
    this.model = getRequiredEnv(this.configService, 'AI_MODEL');
    this.client = new OpenAI({
      apiKey: this.apiKey,
    });
  }

  async sendMessage(message: string, context?: AIContext): Promise<AIResponse> {
    try {
      const messages = this.buildMessages(message, context);

      const response = await this.client.responses.create({
        model: this.model,
        input: messages,
        max_output_tokens: MAX_OUTPUT_TOKENS,
        temperature: TEMPERATURE,
      });

      const content = response.output_text || '';

      return {
        content,
      };
    } catch (error) {
      this.logger.error('AI 서비스 오류:', error);
      throw error;
    }
  }

  private buildMessages(
    message: string,
    context?: AIContext,
  ): Array<{
    role: MessageRole;
    content: string;
  }> {
    const messages: Array<{
      role: MessageRole;
      content: string;
    }> = [];

    if (context?.systemPrompt) {
      messages.push({
        role: MessageRole.SYSTEM,
        content: context.systemPrompt,
      });
    }

    if (context?.conversationHistory) {
      messages.push(...context.conversationHistory);
    }

    messages.push({
      role: MessageRole.USER,
      content: message,
    });

    return messages;
  }
}
