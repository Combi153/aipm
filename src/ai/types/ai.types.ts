import { MessageRole } from '../enums/message-role.enum';

export class AIContext {
  systemPrompt?: string;
  conversationHistory?: Array<{
    role: MessageRole;
    content: string;
  }>;

  constructor(
    systemPrompt?: string,
    conversationHistory?: Array<{
      role: MessageRole;
      content: string;
    }>,
  ) {
    this.systemPrompt = systemPrompt;
    this.conversationHistory = conversationHistory;
  }
}

export class AIResponse {
  content: string;

  constructor(content: string) {
    this.content = content;
  }
}
