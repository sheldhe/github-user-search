import { parseUserSearchFromParams } from "./userSearchUrl";
import { buildUserSearchQ } from "./userSearchQuery";
import { DEFAULT_QUERY } from "./userSearchDefaults";

// 초기검색 SSR테스트용
export function resolveInitialUserSearch(searchParams: Record<string, any>) {
  const { filters, sort, order, perPage } =
    parseUserSearchFromParams(searchParams);
  const q =
    buildUserSearchQ(filters) || buildUserSearchQ(DEFAULT_QUERY.filters)!;

  return { q, sort, order, perPage, filters };
}
