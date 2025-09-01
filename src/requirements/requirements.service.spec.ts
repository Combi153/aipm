import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from '../ai/ai.service';
import { RequirementsService } from './requirements.service';

describe('RequirementsService', () => {
  let service: RequirementsService;
  let aiService: jest.Mocked<AiService>;

  beforeEach(async () => {
    const mockAiService = {
      sendMessage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequirementsService,
        {
          provide: AiService,
          useValue: mockAiService,
        },
      ],
    }).compile();

    service = module.get<RequirementsService>(RequirementsService);
    aiService = module.get(AiService);
  });

  describe('analyzeWorkRequest', () => {
    it('새로운 기능 개발 요청을 올바르게 분석해야 한다', async () => {
      // given
      const message = '우리 친구 추천하면 포인트 주는 기능 넣자!';
      const mockResponse = {
        content: JSON.stringify({
          isWorkRequest: true,
          intentType: 'feature_request',
        }),
        model: 'gpt-4o',
      };

      aiService.sendMessage.mockResolvedValue(mockResponse);

      // when
      const result = await service.analyzeWorkRequest(message);

      // then
      expect(result.isWorkRequest).toBe(true);
      expect(result.intentType).toBe('feature_request');
      expect(aiService.sendMessage).toHaveBeenCalledWith(
        message,
        expect.objectContaining({
          systemPrompt: expect.stringContaining(
            '업무 요청인지 판단하는 AI 어시스턴트',
          ),
        }),
      );
    });

    it('버그 리포트를 올바르게 분석해야 한다', async () => {
      // given
      const message = '로그인 버튼이 작동하지 않아요';
      const mockResponse = {
        content: JSON.stringify({
          isWorkRequest: true,
          intentType: 'bug_report',
        }),
        model: 'gpt-4o',
      };

      aiService.sendMessage.mockResolvedValue(mockResponse);

      // when
      const result = await service.analyzeWorkRequest(message);

      // then
      expect(result.isWorkRequest).toBe(true);
      expect(result.intentType).toBe('bug_report');
    });

    it('일반적인 질문을 올바르게 분석해야 한다', async () => {
      // given
      const message = '안녕하세요! 오늘 날씨가 어때요?';
      const mockResponse = {
        content: JSON.stringify({
          isWorkRequest: false,
          intentType: 'general_inquiry',
        }),
        model: 'gpt-4o',
      };

      aiService.sendMessage.mockResolvedValue(mockResponse);

      // when
      const result = await service.analyzeWorkRequest(message);

      // then
      expect(result.isWorkRequest).toBe(false);
      expect(result.intentType).toBe('general_inquiry');
    });
  });
});
