# GPT 사용 내역 및 활용 범위

본 프로젝트는 개발 과정에서 GPT를 설계 보조 및 문제 해결을 위한 참고 도구로 활용하였습니다.
GPT는 자동 코드 생성 도구가 아닌, 개발자의 판단을 보조하는 역할로 제한적으로 사용되었습니다.

## GPT 활용 범위

GPT는 다음과 같은 영역에서 검토·아이디어 보조·트러블슈팅 가이드 용도로 사용되었습니다.

- 아키텍처 설계
- Clean Architecture 기반 레이어 분리 전략 검토
- Domain / Server / Client 책임 분리 방향성 정리
- Monorepo + Turborepo 구조 설계 보조
- Next.js App Router 구조 이해
- Server Component / Client Component 경계 설계
- SSR → CSR hydration 흐름 점검
- URL ↔ 상태 동기화 전략 검토
- 테스트 전략 수립
- Jest 단위 / 통합 테스트 대상 정의
- Cypress E2E 테스트 시나리오 구성
- 검색, 정렬, 페이징, 데이터 표시 안전성 테스트 설계
- 환경 및 설정 이슈 해결
- Jest ↔ Cypress 타입 충돌 원인 분석
- tsconfig 환경 분리 전략 수립
- ESLint / TypeScript 설정 관련 문제 해결
- 성능 및 최적화 아이디어
- WebAssembly 기반 Avatar 이미지 처리 구조 검토
- Canvas + WASM 메모리 처리 흐름 설명 보조

## GPT를 사용하지 않은 영역

다음 항목들은 GPT가 직접 생성하거나 자동으로 완성하지 않았으며,
개발자가 직접 구현·검증·수정하였습니다.

- 실제 비즈니스 로직 및 도메인 모델 정의
- GitHub Search API 연동 로직
- 검색 쿼리 빌더 및 필터 로직 구현
- Client Controller / UI 컴포넌트 분리
- 테스트 코드 실제 작성 및 실패 케이스 수정
- 에러 핸들링 및 Rate Limit 대응 로직
- Cypress / Jest 테스트 통과를 위한 코드 수정

최종 정리

GPT는 본 프로젝트에서 설계 방향 검토와 문제 해결을 돕는 보조 도구로 활용되었으며,
모든 핵심 코드, 로직 결정, 테스트 구현 및 최종 결과물에 대한 책임은 개발자 본인에게 있습니다.
