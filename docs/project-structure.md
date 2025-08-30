# Cl.ai - Project Structure

## 프로젝트 구조 및 아키텍처 가이드

---

## 🏗️ 전체 프로젝트 구조

```
aipm/
├── docs/                   # 프로젝트 문서
│   ├── prd.md             # Product Requirements Document
│   ├── tasklist.md        # 개발 태스크 리스트
│   ├── project-structure.md # 프로젝트 구조 (현재 문서)
│   └── user-manual.md     # 사용자 매뉴얼 (작성 예정)
├── src/                    # 소스 코드
│   ├── main.ts            # 애플리케이션 진입점
│   ├── app.module.ts      # 루트 모듈
│   ├── app.controller.ts  # 루트 컨트롤러
│   ├── app.service.ts     # 루트 서비스
│   ├── slack/             # Slack 연동 모듈
│   ├── ai/                # AI 서비스 모듈
│   ├── requirements/      # 요구사항 관리 모듈
│   ├── common/            # 공통 유틸리티
│   └── config/            # 설정 관리
├── test/                   # 테스트 파일
├── dist/                   # 빌드 결과물
├── node_modules/           # 의존성 패키지
├── .env                    # 환경 변수
├── .gitignore             # Git 무시 파일
├── package.json            # 프로젝트 설정
├── tsconfig.json           # TypeScript 설정
├── nest-cli.json          # NestJS CLI 설정
└── README.md               # 프로젝트 소개
```

---

## 📁 주요 모듈 구조

### **1. Slack 연동 모듈 (slack/)**

- Slack API 연동 및 이벤트 처리
- 메시지 수신 및 응답 전송
- 스레드 생성 및 관리

### **2. AI 서비스 모듈 (ai/)**

- OpenAI GPT-4 및 Claude API 연동
- 의도 파악 및 모호성 탐지
- 질문 생성 및 응답 처리

### **3. 요구사항 관리 모듈 (requirements/)**

- 요구사항 분석 및 처리
- 질문 템플릿 관리
- 세션 및 상태 관리

### **4. 공통 유틸리티 (common/)**

- 공통 데코레이터, 필터, 가드
- 유틸리티 함수 및 상수
- 예외 처리 및 로깅

### **5. 설정 관리 (config/)**

- 환경 변수 및 설정 로딩
- 모듈별 설정 관리
- 검증 및 기본값 설정

---

## 🔧 모듈 의존성 관계

```
app.module.ts (루트)
├── slack.module.ts         # Slack 연동
├── ai.module.ts            # AI 서비스
├── requirements.module.ts   # 요구사항 관리
└── common/                 # 공통 유틸리티
```

---

## 🎯 아키텍처 원칙

### **1. 모듈화**

- 각 기능별로 독립적인 모듈 구성
- 명확한 책임 분리 (Single Responsibility Principle)
- 느슨한 결합 (Loose Coupling)

### **2. 의존성 주입**

- NestJS의 DI 컨테이너 활용
- 인터페이스 기반 설계
- 테스트 용이성 확보

### **3. 에러 처리**

- 중앙집중식 예외 처리
- 일관된 에러 응답 형식
- 상세한 로깅 및 모니터링

### **4. 확장성**

- 플러그인 방식의 AI 제공자 지원
- 템플릿 기반 질문 생성
- 설정 기반 동작 제어

---

## 📝 네이밍 컨벤션

### **1. 파일명**

- `kebab-case` 사용 (예: `slack.service.ts`)
- 기능별 접미사 사용 (`.service.ts`, `.controller.ts`, `.module.ts`)

### **2. 클래스명**

- `PascalCase` 사용 (예: `SlackService`)
- 명확하고 설명적인 이름

### **3. 메서드명**

- `camelCase` 사용 (예: `processMessage()`)
- 동사로 시작하는 명령형 이름

### **4. 변수명**

- `camelCase` 사용 (예: `messageContent`)
- 의미를 명확히 표현하는 이름

---

## 🚀 향후 확장 계획

### **1. 마이크로서비스 전환**

- Slack 모듈을 독립 서비스로 분리
- AI 서비스를 별도 서비스로 분리
- API Gateway 도입

### **2. 데이터베이스 통합**

- PostgreSQL/MongoDB 연동
- 데이터 영속성 확보
- 백업 및 복구 시스템

### **3. 외부 도구 연동**

- Jira, Notion 등 연동
- CI/CD 파이프라인 통합
- 모니터링 도구 연동

---

## 📚 관련 문서

- [PRD (Product Requirements Document)](prd.md)
- [Task List](tasklist.md)
- [User Manual](user-manual.md) - 작성 예정

---

이 문서는 Cl.ai 프로젝트의 구조와 아키텍처를 이해하는 데 도움이 됩니다. 개발 과정에서 구조가 변경될 수 있으니, 정기적으로 업데이트하는 것을 권장합니다.
