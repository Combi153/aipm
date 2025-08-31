import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { App } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { AiService } from '../ai/ai.service';
import { getRequiredEnv } from '../common/utils/env.util';
import { SlackMessage } from './slack.types';

@Injectable()
export class SlackService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SlackService.name);
  private app: App;
  private webClient: WebClient;
  private isConnected = false;

  constructor(
    private configService: ConfigService,
    private aiService: AiService,
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
          const aiResponse = await this.aiService.sendMessage(
            slackMessage.text,
            {
              systemPrompt:
                '당신은 도움이 되는 AI 어시스턴트입니다. 사용자의 메시지에 친근하고 도움이 되는 답변을 해주세요.',
              userInfo: {
                userId: slackMessage.user,
              },
            },
          );

          await say({
            text: aiResponse.output_text,
            thread_ts: slackMessage.ts,
          });
        } catch (aiError) {
          this.logger.error('AI 서비스 오류:', aiError);
          await say({
            text: '죄송합니다. AI 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
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
}
