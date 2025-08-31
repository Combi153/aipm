import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { App } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import { getRequiredEnv } from '../common/utils/env.util';
import { SlackMessage } from './slack.types';

@Injectable()
export class SlackService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SlackService.name);
  private app: App;
  private webClient: WebClient;
  private isConnected = false;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeSlackApp();
  }

  async onModuleDestroy() {
    if (this.app) {
      await this.app.stop();
    }
  }

  private async initializeSlackApp() {
    try {
      const botToken = getRequiredEnv(this.configService, 'SLACK_BOT_TOKEN');
      const signingSecret = getRequiredEnv(
        this.configService,
        'SLACK_SIGNING_SECRET',
      );
      const appToken = getRequiredEnv(this.configService, 'SLACK_APP_TOKEN');

      // Slack App 초기화
      this.app = new App({
        token: botToken,
        signingSecret: signingSecret,
        socketMode: true,
        appToken: appToken,
      });

      // WebClient 초기화
      this.webClient = new WebClient(botToken);

      // 메시지 수신 이벤트만 등록
      this.setupMessageListener();

      // App 시작
      await this.app.start();
      this.isConnected = true;
      this.logger.log('Slack App이 성공적으로 시작되었습니다.');
    } catch (error) {
      this.logger.error('Slack App 초기화 실패:', error);
      throw error;
    }
  }

  private setupMessageListener() {
    // 메시지 이벤트 리스너 (하나만 사용)
    this.app.message(async ({ message, say }) => {
      try {
        const slackMessage = message as SlackMessage;

        // 봇 메시지는 무시
        if (slackMessage.bot_id) {
          this.logger.log('봇 메시지 무시됨');
          return;
        }

        this.logger.log('=== 새 메시지 수신 ===');
        this.logger.log(`채널: ${slackMessage.channel}`);
        this.logger.log(`사용자: ${slackMessage.user}`);
        this.logger.log(`메시지: ${slackMessage.text}`);
        this.logger.log(`시간: ${slackMessage.ts}`);
        this.logger.log('====================');

        // 간단한 응답 (테스트용)
        await say({
          text: `메시지를 받았습니다: "${slackMessage.text}"`,
          thread_ts: slackMessage.ts,
        });
      } catch (error) {
        this.logger.error('메시지 처리 중 오류:', error);
      }
    });
  }

  // 연결 상태 확인
  isAppConnected(): boolean {
    return this.isConnected;
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      timestamp: new Date().toISOString(),
    };
  }
}
