import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Response } from 'openai/resources/responses/responses';
import { getRequiredEnv } from '../common/utils/env.util';
import { AIMessageContext } from './ai.types';

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

  async sendMessage(
    message: string,
    context?: AIMessageContext,
  ): Promise<Response & { _request_id?: string | null | undefined }> {
    try {
      const response = await this.client.responses.create({
        model: this.model,
        input: `please write a poem about the following topic: ${message}`,
      });
      console.log(response);
      return response;
    } catch (error) {
      this.logger.error('AI 서비스 오류:', error);
      throw error;
    }
  }
}
