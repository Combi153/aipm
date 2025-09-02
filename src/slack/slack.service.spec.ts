import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRequiredEnv } from '../common/utils/env.util';
import { RequirementsService } from '../requirements/requirements.service';
import { SlackService } from './slack.service';

// Slack 관련 모듈들을 모킹
jest.mock('@slack/bolt', () => ({
  App: jest.fn().mockImplementation(() => ({
    message: jest.fn(),
    start: jest.fn().mockResolvedValue(undefined),
    stop: jest.fn().mockResolvedValue(undefined),
  })),
}));

jest.mock('@slack/web-api', () => ({
  WebClient: jest.fn().mockImplementation(() => ({
    // WebClient 메서드들을 모킹
  })),
}));

// getRequiredEnv 함수를 모킹
jest.mock('../common/utils/env.util');
const mockGetRequiredEnv = getRequiredEnv as jest.MockedFunction<
  typeof getRequiredEnv
>;

describe('SlackService', () => {
  let service: SlackService;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockRequirementsService: jest.Mocked<RequirementsService>;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn(),
    } as any;

    mockRequirementsService = {
      detectWorkRequest: jest.fn(),
    } as any;

    mockGetRequiredEnv.mockImplementation((configService, key) => {
      const mockValues: Record<string, string> = {
        SLACK_BOT_TOKEN: 'mock-bot-token',
        SLACK_SIGNING_SECRET: 'mock-signing-secret',
        SLACK_APP_TOKEN: 'mock-app-token',
      };
      return mockValues[key] || 'mock-value';
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlackService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: RequirementsService,
          useValue: mockRequirementsService,
        },
      ],
    }).compile();

    service = module.get<SlackService>(SlackService);
  });

  it('연결 상태를 확인할 수 있어야 한다', () => {
    expect(typeof service.isAppConnected).toBe('function');
    expect(typeof service.getConnectionStatus).toBe('function');
  });

  it('연결 상태가 올바르게 반환되어야 한다', () => {
    // when
    const status = service.getConnectionStatus();

    // then
    expect(status).toHaveProperty('isConnected');
    expect(status).toHaveProperty('timestamp');
    expect(typeof status.isConnected).toBe('boolean');
    expect(typeof status.timestamp).toBe('string');
  });
});
