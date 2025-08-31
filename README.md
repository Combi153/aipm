<p align="center">
  <img src="https://img.shields.io/badge/Cl.ai-AI%20Requirements%20Bot-blue?style=for-the-badge&logo=slack" alt="Cl.ai" />
</p>

<p align="center">
  <strong>AI-Powered Requirements Clarification Bot for Slack</strong>
</p>

---

## 📋 Description

**Cl.ai**는 슬랙(Slack) 내에서 발생하는 불명확한 요구사항을 AI가 자동으로 감지하고, 체계적인 질문을 통해 요구사항을 구체화시키는 AI 어시스턴트 봇입니다.

### 🎯 주요 기능

- **실시간 메시지 감지**: 지정된 슬랙 채널의 메시지를 실시간으로 모니터링
- **AI 의도 파악**: LLM을 통한 업무 요청 의도 자동 감지
- **모호성 탐지**: 요구사항의 불명확한 부분을 자동으로 식별
- **스마트 질문 생성**: 사전 정의된 템플릿과 AI 기반 맞춤형 질문 생성
- **스레드 기반 인터랙션**: 채널 피로도를 최소화하는 스레드 방식

### 🚀 해결하는 문제

- 개발자의 재작업 감소 (목표: 30% 이상)
- 커뮤니케이션 비용 절감
- 요구사항 자동 문서화
- 팀 생산성 향상

---

## 🛠️ Tech Stack

- **Backend**: [NestJS](https://nestjs.com/) - Node.js 프레임워크
- **AI/ML**: OpenAI GPT-4 API / Anthropic Claude API
- **Slack Integration**: Slack Events API, @slack/bolt
- **Language**: TypeScript
- **Infrastructure**: AWS 또는 NHN Cloud

---

## 📦 Installation

### Prerequisites

- Node.js 18.x 이상
- npm 또는 yarn
- Slack App 설정 (Bot Token, Event Subscriptions 등)
- OpenAI API 키 또는 Anthropic Claude API 키

### Setup

```bash
# 저장소 클론
$ git clone <repository-url>
$ cd aipm

# 의존성 설치
$ npm install

# 개발 모드 실행
$ npm run start:dev

# 프로덕션 빌드
$ npm run build
$ npm run start:prod
```

---

## ⚙️ Configuration

### Environment Variables

```env
# Slack 설정
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-app-token

# AI API 설정
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# 서버 설정
PORT=3000
NODE_ENV=development
```

### Slack App 설정

1. [Slack API](https://api.slack.com/apps)에서 새 앱 생성
2. Bot Token Scopes 설정:
   - `channels:history` - 채널 메시지 읽기
   - `chat:write` - 메시지 전송
   - `channels:read` - 채널 정보 읽기
3. Event Subscriptions 활성화:
   - `message.channels` - 채널 메시지 이벤트
   - `app_mention` - 봇 멘션 이벤트

---

## 🚀 Usage

### 기본 사용법

1. **봇 활성화**: 지정된 채널에 업무 요청 메시지 작성
2. **자동 감지**: Cl.ai가 메시지의 의도를 파악하고 모호성 분석
3. **질문 생성**: 스레드에 구체적인 질문들을 자동 생성
4. **답변 수집**: 팀원들이 질문에 답변하여 요구사항 구체화
5. **완료**: 명확해진 요구사항으로 개발 착수

### 예시

**사용자 입력:**

```
"우리 친구 추천하면 포인트 주는 기능 넣자!"
```

**Cl.ai 응답:**

```
안녕하세요! '친구 추천 기능'에 대한 좋은 아이디어네요.
개발팀이 빠르게 진행할 수 있도록 몇 가지만 명확히 할까요?

1. 추천 방식: (A) 링크 공유, (B) 추천 코드 입력
2. 리워드 지급 시점: (A) 친구가 가입 즉시, (B) 친구가 첫 구매 시
3. 지급 포인트: 추천인과 친구 각각 얼마씩 지급될까요?
```

---

## 🧪 Testing

```bash
# 단위 테스트
$ npm run test

# e2e 테스트
$ npm run test:e2e

# 테스트 커버리지
$ npm run test:cov

# 테스트 감시 모드
$ npm run test:watch
```

---

## 📊 Monitoring

### 성공 지표

- **봇 활성화 횟수**: 주간 업무 요청 중 Cl.ai 개입 비율
- **요구사항 완료율**: 질문 스레드 완료율 (목표: 70% 이상)
- **응답 시간**: 질문 생성부터 답변 완료까지의 평균 시간
- **재작업 감소율**: 도입 전후 재작업 발생 빈도 비교

---

## 🏗️ Project Structure

프로젝트의 상세한 구조와 아키텍처는 [Project Structure 문서](docs/project-structure.md)를 참조하세요.

### 주요 모듈

- **slack/**: Slack 연동 및 이벤트 처리
- **ai/**: AI 서비스 (OpenAI/Claude) 연동
- **requirements/**: 요구사항 분석 및 질문 생성
- **common/**: 공통 유틸리티 및 미들웨어
- **config/**: 설정 관리 및 환경 변수

---

## 🔧 Development

### 개발 환경 설정

```bash
# 개발 모드 실행
$ npm run start:dev

# 코드 포맷팅
$ npm run format

# 린트 검사
$ npm run lint

# 타입 체크
$ npm run type-check
```

---

## 📚 Documentation

- [PRD (Product Requirements Document)](docs/prd.md)
- [Task List](docs/tasklist.md)
- [API Documentation](docs/api.md) - 작성 예정
- [User Manual](docs/user-manual.md) - 작성 예정

---

<p align="center">
  <strong>Cl.ai로 팀의 요구사항을 명확하게, 개발을 효율적으로!</strong>
</p>
