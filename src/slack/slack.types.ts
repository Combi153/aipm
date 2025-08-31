export interface SlackMessage {
  channel: string;
  text: string;
  thread_ts?: string;
  user: string;
  ts: string;
  bot_id?: string;
}
