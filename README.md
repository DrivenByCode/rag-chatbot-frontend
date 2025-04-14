# RAG 챗봇 프론트엔드

본 프로젝트는 **RAG (Retrieval-Augmented Generation)** 기반의 LLM 챗봇 애플리케이션의 프론트엔드 부분으로,
React와 TypeScript를 이용하여 제작되었습니다. Spring Boot/Spring AI 백엔드와 REST API로 연동되어
실시간 채팅 인터페이스를 제공하고 사용자와의 대화 이력을 관리합니다.

## 주요 기능

- **대화형 UI 및 실시간 상호작용**

  - 직관적인 채팅 인터페이스
  - 마크다운 및 KaTeX를 통한 포맷팅(코드 블록, 리스트, 수식)
  - 자동 스크롤 및 대화 이력 관리

- **사용자 경험 최적화**

  - 반응형 디자인(모바일 및 데스크탑 지원)
  - 다크/라이트 테마 지원
  - 위치 조정 가능한 채팅 위젯

- **백엔드 연동**
  - REST API를 통한 Spring Boot 백엔드 통신
  - 세션 ID를 통한 대화 이력 관리
  - 관리자 페이지를 통한 FAQ 데이터 관리

## 기술 스택

- **프레임워크**: React 19, TypeScript
- **상태 관리**: Redux Toolkit, React Hooks
- **스타일링**: Tailwind CSS
- **빌드 도구**: Vite
- **라우팅**: React Router DOM 7
- **HTTP 클라이언트**: Axios
- **마크다운/수식**: React Markdown, KaTeX

## 프로젝트 구조

```
rag-chatbot-frontend/
├── src/
│   ├── api/              # 백엔드 API 통신 모듈
│   ├── components/       # UI 컴포넌트
│   ├── constants/        # 상수 정의
│   ├── hooks/            # 커스텀 훅
│   ├── pages/            # 페이지 컴포넌트
│   ├── store/            # Redux 스토어
│   ├── types/            # TypeScript 타입
│   ├── App.tsx           # 메인 애플리케이션
│   └── main.tsx          # 엔트리 포인트
├── public/               # 정적 파일
└── 설정 파일들
```

## 시작하기

### 필수 조건

- Node.js 18 이상
- pnpm

### 설치

```bash
# 패키지 설치
pnpm install
```

### 개발 서버 실행

```bash
# 개발 서버 실행 (http://localhost:5173)
pnpm dev
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
```

## 환경 변수 설정

`.env` 또는 `.env.development` 파일에 다음 변수를 설정하세요:

```
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=RAG 챗봇
```

## 백엔드 연동

이 프론트엔드 애플리케이션은 다음 API와 통신합니다:

1. **채팅 API**: `/chat/ask?sessionId={sessionId}`

   - 요청: 사용자 메시지 (text/plain)
   - 응답: `{ reply: string, finishReason: string }`

2. **관리자 API**: `/api/faq/*`
   - FAQ 데이터 관리 엔드포인트

## 추가 기능

- **챗봇 위젯**: 외부 웹사이트에 임베딩 가능한 채팅 위젯 제공
- **관리자 페이지**: FAQ 데이터 관리 및 시스템 상태 모니터링
- **테마 지원**: 라이트/다크 테마 전환 옵션

## 문제 해결 및 기여

버그 제보나 기능 개선 제안은 GitHub Issues를 통해 알려주세요.
풀 리퀘스트도 환영합니다!
