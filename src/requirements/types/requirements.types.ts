import { WorkRequestIntentType } from '../enums/work-request-intent.enum';

export interface WorkRequestAnalysis {
  isWorkRequest: boolean;
  intentType: WorkRequestIntentType;
}
