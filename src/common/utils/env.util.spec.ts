import { getRequiredEnv } from './env.util';

describe('getRequiredEnv', () => {
  let mockConfigService: { get: jest.Mock };

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn(),
    };
  });

  it('환경변수가 설정되어 있을 때 값을 반환해야 한다', () => {
    // Given
    mockConfigService.get.mockReturnValue('test_value');

    // When
    const result = getRequiredEnv(mockConfigService, 'TEST_KEY');

    // Then
    expect(result).toBe('test_value');
  });

  it('환경변수가 설정되어 있지 않을 때 에러를 던져야 한다', () => {
    // Given
    mockConfigService.get.mockReturnValue(undefined);

    // When & Then
    expect(() => getRequiredEnv(mockConfigService, 'TEST_KEY')).toThrow(
      '필수 환경변수 TEST_KEY가 설정되지 않았습니다',
    );
  });

  it('빈 문자열 환경변수에 대해서도 에러를 던져야 한다', () => {
    // Given
    mockConfigService.get.mockReturnValue('');

    // When & Then
    expect(() => getRequiredEnv(mockConfigService, 'TEST_KEY')).toThrow(
      '필수 환경변수 TEST_KEY가 설정되지 않았습니다',
    );
  });
});
