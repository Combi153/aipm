import { MessageRole } from '../enums/message-role.enum';

export interface AIContext {
  systemPrompt?: string;
  conversationHistory?: Array<{
    role: MessageRole;
    content: string;
  }>;
}

export interface AIResponse {
  content: string;
}
