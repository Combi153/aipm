import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { App, SayFn } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { getRequiredEnv } from '../common/utils/env.util';
import { QuestionSet, QuestionType } from '../requirements/domain/question-set';
import { RequirementsService } from '../requirements/requirements.service';
import { SlackMessage } from './slack.types';

@Injectable()
export class SlackService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SlackService.name);
  private app: App;
  private webClient: WebClient;
  private isConnected = false;

  constructor(
    private configService: ConfigService,
    private requirementsService: RequirementsService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.initializeSlackApp();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.app) {
      await this.app.stop();
    }
  }

  private async initializeSlackApp(): Promise<void> {
    try {
      const botToken = getRequiredEnv(this.configService, 'SLACK_BOT_TOKEN');
      const signingSecret = getRequiredEnv(
        this.configService,
        'SLACK_SIGNING_SECRET',
      );
      const appToken = getRequiredEnv(this.configService, 'SLACK_APP_TOKEN');

      this.app = new App({
        token: botToken,
        signingSecret: signingSecret,
        socketMode: true,
        appToken: appToken,
      });

      this.webClient = new WebClient(botToken);

      this.setupMessageListener();

      await this.app.start();
      this.isConnected = true;
      this.logger.log('Slack App이 성공적으로 시작되었습니다.');
    } catch (error) {
      this.logger.error('Slack App 초기화 실패:', error);
      throw error;
    }
  }

  private setupMessageListener(): void {
    this.app.message(async ({ message, say }) => {
      try {
        const slackMessage = message as SlackMessage;

        if (slackMessage.bot_id) {
          return;
        }

        this.logger.log('=== 새 메시지 수신 ===');
        this.logger.log(`채널: ${slackMessage.channel}`);
        this.logger.log(`사용자: ${slackMessage.user}`);
        this.logger.log(`메시지: ${slackMessage.text}`);
        this.logger.log(`시간: ${slackMessage.ts}`);
        this.logger.log('====================');

        try {
          const detectResult = await this.requirementsService.detectWorkRequest(
            slackMessage.text,
          );

          if (detectResult.isWorkRequest) {
            this.logger.log('업무 요청으로 감지됨');
            this.logger.log(`의도 타입: ${detectResult.intentType}`);

            const questionSet =
              await this.requirementsService.generateQuestions(
                slackMessage.text,
                detectResult,
              );

            await this.sendQuestionsToSlack(slackMessage, questionSet, say);
          }
        } catch (error) {
          this.logger.error('요구사항 분석 서비스 오류:', error);
          await say({
            text: '죄송합니다. 요구사항 분석 서비스에 일시적인 문제가 발생했습니다.',
            thread_ts: slackMessage.ts,
          });
        }
      } catch (error) {
        this.logger.error('메시지 처리 중 오류:', error);
      }
    });
  }

  isAppConnected(): boolean {
    return this.isConnected;
  }

  getConnectionStatus(): { isConnected: boolean; timestamp: string } {
    return {
      isConnected: this.isConnected,
      timestamp: new Date().toISOString(),
    };
  }

  private async sendQuestionsToSlack(
    slackMessage: SlackMessage,
    questionSet: QuestionSet,
    say: SayFn,
  ): Promise<void> {
    const introMessage = `안녕하세요! 업무 요청을 구체화하기 위해 몇 가지 질문을 드리겠습니다. 개발팀이 빠르게 진행할 수 있도록 답변해 주세요! 📝`;

    await say({
      text: introMessage,
      thread_ts: slackMessage.ts,
    });

    for (const question of questionSet.questions) {
      let questionText = `*${question.id}.* ${question.question}`;

      if (question.type === QuestionType.MULTIPLE_CHOICE && question.options) {
        questionText += '\n\n';
        question.options.forEach((option: string, index: number) => {
          questionText += `${index + 1}. ${option}\n`;
        });
        questionText += '\n답변 예시: `1`, `2`, `3` 또는 텍스트로 자유 답변';
      } else if (question.type === QuestionType.NUMBER) {
        questionText += '\n\n답변 예시: `100`, `50%` 등';
      } else {
        questionText += '\n\n자유롭게 답변해 주세요.';
      }

      await say({
        text: questionText,
        thread_ts: slackMessage.ts,
      });
    }

    const summaryMessage = `\n---\n*세션 ID: ${questionSet.sessionId}*\n모든 질문에 답변하시면 요구사항이 구체화됩니다. 추가 질문이 있으시면 언제든 말씀해 주세요! 💬`;

    await say({
      text: summaryMessage,
      thread_ts: slackMessage.ts,
    });
  }
}
