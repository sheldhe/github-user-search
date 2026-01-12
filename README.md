# 개발 및 테스트 환경

# Clean Architecture + Modularity

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

- Next.js (App Router)
  -- Server Components / Client Components 분리
  -- Route Segment 기반 구조
- TypeScript
  -- strict 모드 활성화
  -- 타입 안정성을 통한 런타임 오류 최소화
- ES2023

## Jest + Cypress Type 충돌 이슈

Jest(단위/통합 테스트)와 Cypress(E2E 테스트)는 모두 전역 expect 타입을 제공하지만,
Jest는 matcher 확장 기반(toHaveBeenCalled 등), Cypress는 Chai 기반(Assertion)이라
TypeScript가 Cypress 타입을 먼저 잡는 경우 Jest matcher들이 타입 에러로 보일 수 있습니다.

해결: tsconfig를 환경별로 분리하여 타입 스코프를 격리했습니다.

앱 코드: root tsconfig

Jest: **tests**/tsconfig.json → "types": ["jest","node"]

Cypress: cypress/tsconfig.json → "types": ["cypress","node"]

root tsconfig에서 cypress/, **tests**/ 등을 exclude하여 혼합 방지
