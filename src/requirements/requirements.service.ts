import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { AIContext, AIResponse } from '../ai/types/ai.types';
import { DetectResult } from './domain/detect-result';
import { Question, QuestionSet, QuestionType } from './domain/question-set';
import { QUESTION_GENERATION_PROMPT } from './prompts/question-generation.prompt';
import { WORK_REQUEST_ANALYSIS_PROMPT } from './prompts/work-request-analysis.prompt';

@Injectable()
export class RequirementsService {
  constructor(private readonly aiService: AiService) {}

  async detectWorkRequest(message: string): Promise<DetectResult> {
    const context = new AIContext(WORK_REQUEST_ANALYSIS_PROMPT);
    const response = await this.aiService.sendMessage(message, context);
    return this.parseResult(response);
  }

  async generateQuestions(
    originalMessage: string,
    detectResult: DetectResult,
  ): Promise<QuestionSet> {
    const context = new AIContext(QUESTION_GENERATION_PROMPT);
    const prompt = `업무 요청: ${originalMessage}\n유형: ${detectResult.intentType}`;
    const response = await this.aiService.sendMessage(prompt, context);
    return this.parseQuestions(response);
  }

  private parseResult(response: AIResponse): DetectResult {
    const parsedData = JSON.parse(response.content);
    return new DetectResult(parsedData.isWorkRequest, parsedData.intentType);
  }

  private parseQuestions(response: AIResponse): QuestionSet {
    const parsedData = JSON.parse(response.content);
    const questions = parsedData.questions.map((q: any) => {
      return new Question(
        q.id,
        q.question,
        q.type as QuestionType,
        q.options,
        q.required,
      );
    });

    return new QuestionSet(questions, 'session_id', new Date());
  }
}
