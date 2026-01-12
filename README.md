# 개발 및 테스트 환경

## Clean Architecture + Modularity

본 프로젝트는 Clean Architecture를 기반으로 하여
도메인 로직, 애플리케이션 로직, UI 레이어를 명확히 분리합니다.

- 비즈니스 로직은 프레임워크(Next.js, React)에 의존하지 않도록 설계
- 의존성 방향은 항상 바깥 → 안쪽을 향함
- 각 레이어는 독립적으로 테스트 가능하도록 구성
  이를 통해 다음을 목표로 합니다.
- 변경에 강한 구조
- 테스트 용이성
- 기능 단위 확장 및 유지보수성 향상

## Monorepo & Modularity

pnpm + turbo 기반의 Monorepo 구조를 사용합니다.

- 공통 모듈(도메인, 유틸, UI 등)을 패키지 단위로 분리
- 앱 간 코드 중복 최소화
- 터보 레포를 활용한 병렬 빌드 및 캐싱으로 개발 속도 개선
  각 패키지는 독립적인 책임과 명확한 경계를 가지며,
  의존 관계는 최소화합니다.

## Frontend Stack

- **Next.js (App Router)**
  - Server Components / Client Components 분리
  - Route Segment 기반 구조
- **TypeScript**
  - strict 모드 활성화
  - 타입 안정성을 통한 런타임 오류 최소화
- **ES2023**

## Styling

- **MUI** -접근성 및 디자인 시스템 기반 UI 컴포넌트
- **Tailwind CSS**
  - 빠른 UI 프로토타이핑 및 유틸리티 기반 스타일링
- **MUI + Tailwind를 역할 분리하여 사용**
  - 레이아웃 / 간단한 스타일 → Tailwind
  - 복잡한 UI 컴포넌트 → MUI

## WebAssembly 기반 아바타 이미지 처리

아바타 렌더링 성능을 최적화하기 위해 WebAssembly(WASM) 를 활용했습니다.
사전에 컴파일된 avatar.wasm 모듈을 정적 에셋으로 제공하고, 클라이언트에서 지연 로딩(lazy loading) 방식으로 불러옵니다.

- 구현 특징
  Canvas의 이미지 픽셀 데이터를 WASM의 선형 메모리(linear memory) 로 복사
  픽셀 단위의 색상 보정(tint) 연산을 WASM에서 수행하여 성능 향상
  하나의 WASM 인스턴스를 모든 아바타 컴포넌트에서 공유하여
  네트워크 요청 최소화
  컴파일 비용 절감
  메모리 사용 최적화
  사용 및 배포
  별도의 추가 설정이나 빌드 과정이 필요하지 않습니다.
  avatar.wasm 파일은 레포지토리에 포함되어 있으며,
  /public/wasm 경로에서 정적 파일로 제공됩니다.
  새로 프로젝트를 클론한 사용자도 일반적인 개발 명령어만으로 바로 실행할 수 있습니다.

## 실행 방법

- Node.js v20 이상
- pnpm v10 이상
- GitHub Personal Access Token (Search API 호출용)

### 1. 레포지토리 클론 및 의존성 설치

```bash
git clone https://github.com/sheldhe/github-user-search.git
cd github-user-search
pnpm install
```

### 2. 환경 변수 설정

GitHub Search API 사용을 위해 토큰이 필요합니다.(.env.local 파일 생성)

```bash
 GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

## 테스트 실행 방법

본 프로젝트는 Jest (단위/통합) + Cypress (E2E) 를 함께 사용합니다.

### 단위 / 통합 테스트 (Jest)

```bash
pnpm test:unit
pnpm test:watch
```

### 테스트 대상

- 검색 쿼리 생성 로직 (buildUserSearchQ)
- 페이징 로직 (page 증가, append 동작)
- 정렬 / 필터 적용 로직
- CSR 상태 제어 로직 (hook 단위 테스트)

### E2E 테스트 (Cypress)

개발 서버 기반 실행

```bash
pnpm e2e:dev
```

내부 동작:

- Next.js dev 서버 실행
- Cypress 자동 실행
- 테스트 종료 후 서버 종료

### Cypress UI 모드

```bash
pnpm cypress:open
```

### E2E 테스트 범위 정리

- 검색 쿼리 입력 → 결과 렌더링
- 페이징 로직 (Load more / Infinite Scroll)
- 정렬 변경 시 재조회 (Sort / Order)
- Too-broad 검색 방지 (키워드 없음)
- SSR → CSR Hydration 경계 검증
- URL ↔ 상태 동기화

### Jest + Cypress Type 충돌 이슈

Jest(단위/통합 테스트)와 Cypress(E2E 테스트)는 모두 전역 expect 타입을 제공하지만,
Jest는 matcher 확장 기반(toHaveBeenCalled 등), Cypress는 Chai 기반(Assertion)이라
TypeScript가 Cypress 타입을 먼저 잡는 경우 Jest matcher들이 타입 에러로 보일 수 있습니다.

해결: tsconfig를 환경별로 분리하여 타입 스코프를 격리했습니다.

앱 코드: root tsconfig

Jest: **tests**/tsconfig.json → "types": ["jest","node"]

Cypress: cypress/tsconfig.json → "types": ["cypress","node"]

root tsconfig에서 cypress/, **tests**/ 등을 exclude하여 혼합 방지
