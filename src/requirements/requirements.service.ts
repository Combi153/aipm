import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { AIContext, AIResponse } from '../ai/types/ai.types';
import { DetectResult } from './domain/detect-result';
import { WORK_REQUEST_ANALYSIS_PROMPT } from './prompts/work-request-analysis.prompt';

@Injectable()
export class RequirementsService {
  constructor(private readonly aiService: AiService) {}

  async detectWorkRequest(message: string): Promise<DetectResult> {
    const context = new AIContext(WORK_REQUEST_ANALYSIS_PROMPT);
    const response = await this.aiService.sendMessage(message, context);
    return this.parseResult(response);
  }

  private parseResult(response: AIResponse): DetectResult {
    const parsedData = JSON.parse(response.content);
    return new DetectResult(parsedData.isWorkRequest, parsedData.intentType);
  }
}
