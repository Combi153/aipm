import { WorkRequestIntentType } from '../enums/work-request-intent.enum';
import { DetectResult } from './detect-result';

describe('DetectResult', () => {
  describe('constructor', () => {
    it('유효한 데이터로 객체를 생성해야 한다', () => {
      // given
      const isWorkRequest = true;
      const intentType = WorkRequestIntentType.FEATURE_REQUEST;

      // when
      const result = new DetectResult(isWorkRequest, intentType);

      // then
      expect(result.isWorkRequest).toBe(true);
      expect(result.intentType).toBe(WorkRequestIntentType.FEATURE_REQUEST);
    });

    it('업무 요청이 아닌 경우에도 올바르게 생성해야 한다', () => {
      // given
      const isWorkRequest = false;
      const intentType = WorkRequestIntentType.GENERAL_INQUIRY;

      // when
      const result = new DetectResult(isWorkRequest, intentType);

      // then
      expect(result.isWorkRequest).toBe(false);
      expect(result.intentType).toBe(WorkRequestIntentType.GENERAL_INQUIRY);
    });

    it('잘못된 intentType이 들어오면 OTHER를 반환해야 한다', () => {
      // given
      const isWorkRequest = true;
      const invalidIntentType = 'invalid_type' as WorkRequestIntentType;

      // when
      const result = new DetectResult(isWorkRequest, invalidIntentType);

      // then
      expect(result.isWorkRequest).toBe(true);
      expect(result.intentType).toBe(WorkRequestIntentType.OTHER);
    });
  });

  describe('isWorkRequest', () => {
    it('업무 요청 여부를 올바르게 반환해야 한다', () => {
      // given
      const result = new DetectResult(
        true,
        WorkRequestIntentType.FEATURE_REQUEST,
      );

      // when & then
      expect(result.isWorkRequest).toBe(true);
    });
  });

  describe('intentType', () => {
    it('의도 타입을 올바르게 반환해야 한다', () => {
      // given
      const result = new DetectResult(true, WorkRequestIntentType.BUG_REPORT);

      // when & then
      expect(result.intentType).toBe(WorkRequestIntentType.BUG_REPORT);
    });
  });
});
