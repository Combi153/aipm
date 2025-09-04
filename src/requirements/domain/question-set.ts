export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TEXT = 'text',
  NUMBER = 'number',
}

export class Question {
  constructor(
    public readonly id: string,
    public readonly question: string,
    public readonly type: QuestionType,
    public readonly options?: string[],
    public readonly required: boolean = true,
  ) {}
}

export class QuestionSet {
  constructor(
    public readonly questions: Question[],
    public readonly sessionId: string,
    public readonly createdAt: Date,
  ) {}
}
