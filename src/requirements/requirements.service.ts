import { Injectable } from '@nestjs/common';
import { AIResponse } from 'src/ai/types/ai.types';
import { AiService } from '../ai/ai.service';
import { WorkRequestIntentType } from './enums/work-request-intent.enum';
import { WORK_REQUEST_ANALYSIS_PROMPT } from './prompts/work-request-analysis.prompt';
import { WorkRequestAnalysis } from './types/requirements.types';

@Injectable()
export class RequirementsService {
  constructor(private readonly aiService: AiService) {}

  /**
   * 메시지가 업무 요청인지 분석합니다.
   */
  async analyzeWorkRequest(message: string): Promise<WorkRequestAnalysis> {
    const response: AIResponse = await this.aiService.sendMessage(message, {
      systemPrompt: WORK_REQUEST_ANALYSIS_PROMPT,
    });

    const parsed = JSON.parse(response.content);

    return {
      isWorkRequest: Boolean(parsed.isWorkRequest),
      intentType: this.validateIntentType(parsed.intentType),
    };
  }

  /**
   * 의도 타입을 검증하고 반환합니다.
   */
  private validateIntentType(
    intentType: WorkRequestIntentType,
  ): WorkRequestIntentType {
    const validTypes = Object.values(WorkRequestIntentType);
    return validTypes.includes(intentType)
      ? intentType
      : WorkRequestIntentType.OTHER;
  }
}
