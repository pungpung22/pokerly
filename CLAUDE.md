# CLAUDE.md - Pokerly 프로젝트

## 프로젝트 개요

Pokerly는 포커 기록 관리 웹 애플리케이션입니다. AI OCR로 스크린샷에서 데이터를 자동 추출하고, 수익/손실을 분석합니다.

- **프론트엔드**: Next.js 15 (landing 폴더)
- **백엔드**: NestJS 11 (server 폴더)
- **데이터베이스**: PostgreSQL + TypeORM
- **인증**: Firebase Auth (Google/Apple 소셜 로그인)
- **배포**: Cloudflare Pages (프론트엔드)

---

## 개발 서버 실행

### 백엔드 서버 (NestJS)
```bash
cd server
npm run start:dev
```
- **포트**: 9999
- **API 베이스**: http://localhost:9999/api

### 프론트엔드 (Next.js)
```bash
cd landing
npm run dev
```
- **포트**: 3000

---

## 프로젝트 시작 시 필수 확인

> **중요**: 이 프로젝트에서 작업을 시작하기 전에 반드시 `TODO.md` 파일을 먼저 읽어주세요.
> TODO.md에는 현재 진행 중인 개선 사항과 구현 우선순위가 정리되어 있습니다.

---

## 기술 스택

### 프론트엔드 (landing/)
| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 15.x | App Router, Edge Runtime |
| React | 18.x | UI 라이브러리 |
| next-intl | 4.x | 다국어 지원 (ko/en/ja) |
| Firebase | 12.x | 인증, Analytics |
| Framer Motion | 12.x | 애니메이션 |
| Lucide React | - | 아이콘 |
| Tailwind CSS | 4.x | 스타일링 |

### 백엔드 (server/)
| 기술 | 버전 | 용도 |
|------|------|------|
| NestJS | 11.x | 백엔드 프레임워크 |
| TypeORM | 0.3.x | ORM |
| PostgreSQL | - | 데이터베이스 |
| Firebase Admin | 13.x | 토큰 검증 |
| Google Cloud Vision | 5.x | OCR (스크린샷 분석) |
| OpenAI | 6.x | AI 리포트 생성 |
| Passport JWT | - | 인증 미들웨어 |

---

## 폴더 구조

```
pokerly/
├── landing/                    # Next.js 프론트엔드
│   ├── app/
│   │   ├── [locale]/           # 다국어 라우트 (ko/en/ja)
│   │   │   ├── app/            # 앱 내부 페이지 (인증 필요)
│   │   │   │   ├── analytics/  # 분석 페이지
│   │   │   │   ├── sessions/   # 세션 목록
│   │   │   │   ├── upload/     # 스크린샷 업로드
│   │   │   │   ├── level/      # 레벨 & XP
│   │   │   │   ├── missions/   # 챌린지/미션
│   │   │   │   └── settings/   # 설정
│   │   │   ├── components/     # 페이지별 컴포넌트
│   │   │   ├── login/          # 로그인 페이지
│   │   │   ├── terms/          # 이용약관
│   │   │   └── privacy/        # 개인정보처리방침
│   │   └── layout.tsx          # 루트 레이아웃
│   ├── lib/
│   │   ├── api.ts              # API 클라이언트
│   │   ├── firebase.ts         # Firebase 설정
│   │   ├── analytics.ts        # GA4 이벤트 추적
│   │   └── types.ts            # TypeScript 타입
│   ├── messages/               # 다국어 번역 (ko.json, en.json, ja.json)
│   ├── src/i18n/               # next-intl 설정
│   └── public/                 # 정적 파일, sitemap.xml
│
├── server/                     # NestJS 백엔드
│   ├── src/
│   │   ├── entities/           # TypeORM 엔티티
│   │   │   ├── user.entity.ts
│   │   │   ├── session.entity.ts
│   │   │   ├── challenge.entity.ts
│   │   │   ├── trophy.entity.ts
│   │   │   ├── notice.entity.ts
│   │   │   ├── feedback.entity.ts
│   │   │   └── reward.entity.ts
│   │   ├── auth/               # 인증 모듈 (Firebase 토큰 검증)
│   │   ├── users/              # 사용자 모듈
│   │   ├── sessions/           # 세션 모듈 (포커 기록)
│   │   ├── challenges/         # 챌린지 모듈
│   │   ├── trophies/           # 트로피 모듈
│   │   ├── uploads/            # 파일 업로드 + OCR
│   │   ├── ai/                 # AI 리포트 생성
│   │   └── common/             # 공용 모듈
│   └── uploads/                # 업로드된 파일 저장
│
├── CLAUDE.md                   # 이 파일
└── TODO.md                     # 작업 우선순위
```

---

## 핵심 기능 및 도메인

### 1. 세션 (포커 기록)
- 캐시게임 / 토너먼트 구분
- 바이인, 캐시아웃, 수익 계산
- OCR로 스크린샷에서 자동 추출
- 수동 입력도 가능

### 2. 레벨 시스템 (8티어)
```typescript
레벨 1: 관찰자 (0 XP)
레벨 2: 입문자 (50 XP)
레벨 3: 플레이어 (150 XP)
레벨 4: 레귤러 (300 XP)
레벨 5: 샤크 (500 XP)
레벨 6: 마스터 (750 XP)
레벨 7: 그랜드마스터 (1000 XP)
레벨 8: 레전드 (1500 XP)
```

### 3. XP 획득 방법
| 행동 | XP | 제한 |
|------|-----|------|
| 일일 로그인 | 10 | 1회/일 |
| 스크린샷 업로드 | 5 | 무제한 |
| 수동 기록 | 3 | 3회/일 (9XP) |
| 분석 페이지 조회 | 5 | 1회/일 |

### 4. 챌린지/미션
- 타입: sessions, profit, hours, streak, venue
- 상태: active, completed, failed, expired
- 완료 시 포인트 보상

### 5. 트로피 시스템
- 희귀도: common, rare, epic, legendary
- 타입: first_session, winning_streak, profit_milestone 등

### 6. 랭킹 시스템
- 카테고리: winRate, profit, sessions, level, missions
- 옵트인 방식 (닉네임 설정 필요)

---

## API 엔드포인트 구조

### 인증
모든 API는 Firebase ID Token을 `Authorization: Bearer {token}` 헤더로 전송

### 주요 엔드포인트
```
# Users
GET    /api/users/me              # 내 정보
PATCH  /api/users/me              # 정보 수정
POST   /api/users/me/xp           # XP 추가
GET    /api/users/me/level        # 레벨 정보
POST   /api/users/me/ranking      # 랭킹 옵트인
GET    /api/users/ranking         # 전체 랭킹

# Sessions
GET    /api/sessions              # 세션 목록
POST   /api/sessions              # 세션 생성
GET    /api/sessions/stats        # 통계
GET    /api/sessions/analytics    # 분석 데이터
GET    /api/sessions/weekly       # 주간 데이터
GET    /api/sessions/monthly      # 월간 데이터

# Uploads
POST   /api/uploads/screenshot    # 단일 업로드 + OCR
POST   /api/uploads/screenshots   # 다중 업로드 + OCR

# Challenges
GET    /api/challenges            # 챌린지 목록
POST   /api/challenges            # 챌린지 생성
PATCH  /api/challenges/:id/progress # 진행도 업데이트

# AI
GET    /api/ai/report             # AI 분석 리포트
```

---

## 다국어 (i18n) 설정

### 지원 언어
- `ko` (한국어) - 기본값
- `en` (English)
- `ja` (日本語)

### 설정 파일
- `landing/src/i18n/routing.ts` - 라우팅 설정
- `landing/messages/ko.json`, `en.json`, `ja.json` - 번역 파일

### 네임스페이스
- `Landing` - 랜딩 페이지
- `App` - 앱 내부
- `Legal` - 이용약관/개인정보처리방침
- `Metadata` - SEO 메타데이터

---

## 코드 품질 규칙

### 네이밍 컨벤션

#### 파일명 (kebab-case for Next.js, camelCase for NestJS)
```
# Next.js (landing)
✅ user-profile.tsx
✅ auth-provider.tsx

# NestJS (server)
✅ users.service.ts
✅ auth.controller.ts
```

#### 컴포넌트/클래스명 (PascalCase)
```typescript
✅ export function UserProfile() {}
✅ export class UsersService {}
```

#### 변수/함수명 (camelCase)
```typescript
✅ const userName = 'John';
✅ async function fetchUserData() {}
```

### JWT 인증 (필수 패턴)
- **모든 API 인증은 Firebase ID Token 방식**으로 구현
- 프론트엔드: `auth.currentUser.getIdToken()`
- 백엔드: Firebase Admin SDK로 토큰 검증

### Git 커밋 규칙 (필수)
- **기능/변경사항별로 커밋 분리** (뭉뚱그려서 커밋 금지)
- 한 커밋 = 한 가지 목적

#### 커밋 메시지 형식
```
<type>: <설명>

type 종류:
- feat: 새 기능
- fix: 버그 수정
- refactor: 리팩토링
- style: UI/스타일 변경
- docs: 문서 수정
- chore: 설정, 빌드 관련
```

### 보안 및 .gitignore 규칙 (필수)

#### .gitignore 필수 항목
```gitignore
# 환경변수 파일 (절대 커밋 금지)
.env
.env.*
.env.local

# 서버/백엔드 환경변수
server/.env

# 프론트엔드 환경변수
landing/.env.local
```

#### 금지 사항
- ❌ API 키, 시크릿을 코드에 하드코딩
- ❌ .env 파일 커밋
- ❌ Firebase 설정 시크릿 하드코딩
- ❌ 데이터베이스 URL/비밀번호 하드코딩

### 정책 및 브랜딩 규칙
- **회사명/스튜디오명**: `풍풍스튜디` (풍풍스튜디오 ❌)
- 개인정보처리방침, 서비스 이용약관 등 모든 정책 문서에 `풍풍스튜디` 사용
- **웹사이트 URL**: `https://pokerly.co.kr`

---

## 환경변수 (예시)

### 프론트엔드 (landing/.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:9999/api
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### 백엔드 (server/.env)
```env
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
GOOGLE_CLOUD_PROJECT_ID=
GOOGLE_CLOUD_CREDENTIALS=
OPENAI_API_KEY=
```

---

## GA4 커스텀 이벤트

`landing/lib/analytics.ts`에서 관리

| 이벤트명 | 설명 | 파라미터 |
|----------|------|----------|
| `start_free_trial` | CTA 버튼 클릭 | button_location |
| `session_recorded` | 세션 기록 완료 | game_type, recording_method, is_profitable |
| `ocr_upload` | OCR 업로드 | file_count, success |
| `login` | 로그인 | method |
| `sign_up` | 회원가입 | method |
| `level_up` | 레벨업 | new_level |
| `challenge_joined` | 챌린지 참여 | challenge_type |

---

## SEO 구성

### hreflang 태그
- 모든 페이지에 ko/en/ja 대체 언어 링크 포함
- x-default는 한국어(ko)로 설정

### 구조화 데이터 (Schema.org)
- `SoftwareApplication` 타입 사용
- 루트 레이아웃에 JSON-LD 포함

### Sitemap
- `landing/public/sitemap.xml`
- 모든 다국어 페이지 포함 (홈, 약관, 정책, 로그인)
