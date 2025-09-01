import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { RequirementsService } from './requirements.service';

@Module({
  imports: [AiModule],
  providers: [RequirementsService],
  exports: [RequirementsService],
})
export class RequirementsModule {}
