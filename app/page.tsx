import { buildUserSearchQ } from "@/src/domain/github/userSearchQuery";
import ColorModeToggle from "@/src/shared/ui/ColorModeToggle";
import { searchUsers } from "@/src/server/github/searchUsers";
import { DEFAULT_QUERY } from "@/src/domain/github/userSearchDefaults";
import { parseUserSearchFromParams } from "@/src/domain/github/userSearchUrl";
import UserSearchClient from "@/src/features/user-search/components/UserSearchClient";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { filters, sort, order, perPage } = parseUserSearchFromParams(sp);

  const q =
    buildUserSearchQ(filters) || buildUserSearchQ(DEFAULT_QUERY.filters);

  const initial = await searchUsers({
    q,
    page: 1,
    perPage,
    sort,
    order,
  });

  return (
    <>
      <ColorModeToggle />
      <UserSearchClient
        initialQ={q}
        initialData={initial}
        initialFilters={filters}
        initialSort={sort}
        initialOrder={order}
        initialPerPage={perPage}
      />
    </>
  );
}
