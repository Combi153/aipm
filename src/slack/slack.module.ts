import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RequirementsModule } from '../requirements/requirements.module';
import { SlackService } from './slack.service';

@Module({
  imports: [ConfigModule, RequirementsModule],
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {}
