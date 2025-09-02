import { WorkRequestIntentType } from '../enums/work-request-intent.enum';

export class DetectResult {
  private readonly _isWorkRequest: boolean;
  private readonly _intentType: WorkRequestIntentType;

  constructor(isWorkRequest: boolean, intentType: WorkRequestIntentType) {
    const validatedIntentType = this.getIntentTypeOrOther(intentType);
    this._isWorkRequest = isWorkRequest;
    this._intentType = validatedIntentType;
  }

  private getIntentTypeOrOther(
    intentType: WorkRequestIntentType,
  ): WorkRequestIntentType {
    if (!Object.values(WorkRequestIntentType).includes(intentType)) {
      return WorkRequestIntentType.OTHER;
    }
    return intentType;
  }

  get isWorkRequest(): boolean {
    return this._isWorkRequest;
  }

  get intentType(): WorkRequestIntentType {
    return this._intentType;
  }
}
