import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from '../ai/ai.module';
import { SlackService } from './slack.service';

@Module({
  imports: [ConfigModule, AiModule],
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {}
