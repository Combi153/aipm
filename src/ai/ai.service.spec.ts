import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import OpenAI from 'openai';
import { AiService } from './ai.service';
import { MessageRole } from './enums/message-role.enum';

jest.mock('openai');

describe('AiService', () => {
  let service: AiService;
  let mockOpenAI: jest.Mocked<OpenAI>;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockCreate = jest.fn() as jest.MockedFunction<any>;
    const mockOpenAIClient = {
      responses: {
        create: mockCreate,
      },
    };

    const mockConfig = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: mockConfig,
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    mockConfigService = module.get(ConfigService);

    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(
      () => mockOpenAIClient as unknown as OpenAI,
    );
    mockOpenAI = new OpenAI() as jest.Mocked<OpenAI>;
    mockOpenAI.responses.create = mockCreate;
  });

  describe('sendMessage', () => {
    it('기본 메시지를 성공적으로 전송해야 한다', async () => {
      // given
      const message = '안녕하세요';
      const mockResponse = {
        output_text: '안녕하세요! 무엇을 도와드릴까요?',
      };

      mockOpenAI.responses.create.mockResolvedValue(mockResponse);

      // when
      const result = await service.sendMessage(message);

      // then
      expect(result.content).toBe('안녕하세요! 무엇을 도와드릴까요?');
      expect(mockOpenAI.responses.create).toHaveBeenCalledWith({
        model: expect.any(String),
        input: [
          {
            role: MessageRole.USER,
            content: message,
          },
        ],
        max_output_tokens: 2000,
        temperature: 0.7,
      });
    });

    it('시스템 프롬프트가 있는 경우 올바르게 구성해야 한다', async () => {
      // given
      const message = '테스트 메시지';
      const systemPrompt = '당신은 도움이 되는 AI 어시스턴트입니다.';
      const mockResponse = {
        output_text: '도움이 되는 응답입니다.',
      };

      mockOpenAI.responses.create = jest.fn().mockResolvedValue(mockResponse);

      // when
      const result = await service.sendMessage(message, {
        systemPrompt,
      });

      // then
      expect(result.content).toBe('도움이 되는 응답입니다.');
      expect(mockOpenAI.responses.create).toHaveBeenCalledWith({
        model: expect.any(String),
        input: [
          {
            role: MessageRole.SYSTEM,
            content: systemPrompt,
          },
          {
            role: MessageRole.USER,
            content: message,
          },
        ],
        max_output_tokens: 2000,
        temperature: 0.7,
      });
    });

    it('대화 히스토리가 있는 경우 올바르게 구성해야 한다', async () => {
      // given
      const message = '세 번째 메시지';
      const conversationHistory = [
        {
          role: MessageRole.USER,
          content: '첫 번째 메시지',
        },
        {
          role: MessageRole.ASSISTANT,
          content: '첫 번째 응답',
        },
        {
          role: MessageRole.USER,
          content: '두 번째 메시지',
        },
        {
          role: MessageRole.ASSISTANT,
          content: '두 번째 응답',
        },
      ];
      const mockResponse = {
        output_text: '세 번째 응답입니다.',
      };

      mockOpenAI.responses.create = jest.fn().mockResolvedValue(mockResponse);

      // when
      const result = await service.sendMessage(message, {
        conversationHistory,
      });

      // then
      expect(result.content).toBe('세 번째 응답입니다.');
      expect(mockOpenAI.responses.create).toHaveBeenCalledWith({
        model: expect.any(String),
        input: [
          ...conversationHistory,
          {
            role: MessageRole.USER,
            content: message,
          },
        ],
        max_output_tokens: 2000,
        temperature: 0.7,
      });
    });

    it('시스템 프롬프트와 대화 히스토리가 모두 있는 경우 올바르게 구성해야 한다', async () => {
      // given
      const message = '테스트 메시지';
      const systemPrompt = '시스템 프롬프트';
      const conversationHistory = [
        {
          role: MessageRole.USER,
          content: '이전 메시지',
        },
        {
          role: MessageRole.ASSISTANT,
          content: '이전 응답',
        },
      ];
      const mockResponse = {
        output_text: '최종 응답입니다.',
      };

      mockOpenAI.responses.create = jest.fn().mockResolvedValue(mockResponse);

      // when
      const result = await service.sendMessage(message, {
        systemPrompt,
        conversationHistory,
      });

      // then
      expect(result.content).toBe('최종 응답입니다.');
      expect(mockOpenAI.responses.create).toHaveBeenCalledWith({
        model: expect.any(String),
        input: [
          {
            role: MessageRole.SYSTEM,
            content: systemPrompt,
          },
          ...conversationHistory,
          {
            role: MessageRole.USER,
            content: message,
          },
        ],
        max_output_tokens: 2000,
        temperature: 0.7,
      });
    });

    it('output_text가 없는 경우 빈 문자열을 반환해야 한다', async () => {
      // given
      const message = '테스트 메시지';
      const mockResponse = {
        output_text: null,
      };

      mockOpenAI.responses.create = jest.fn().mockResolvedValue(mockResponse);

      // when
      const result = await service.sendMessage(message);

      // then
      expect(result.content).toBe('');
    });

    it('API 오류가 발생하면 예외를 던져야 한다', async () => {
      // given
      const message = '테스트 메시지';
      const error = new Error('API 오류');

      mockOpenAI.responses.create = jest.fn().mockRejectedValue(error);

      // when & then
      await expect(service.sendMessage(message)).rejects.toThrow('API 오류');
    });
  });
});
