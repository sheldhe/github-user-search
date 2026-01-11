import { buildUserSearchQ } from "@/src/domain/github/userSearchQuery";
import ColorModeToggle from "@/src/shared/ui/ColorModeToggle";
import { DEFAULT_QUERY } from "@/src/domain/github/userSearchDefaults";
import { parseUserSearchFromParams } from "@/src/domain/github/userSearchUrl";
import { searchUsers } from "@/src/server/github/searchUsers";
import UserSearchClient from "@/src/features/use-search/components/UserSearchClient";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function Page({ searchParams = {} }: PageProps) {
  const { filters, sort, order, perPage } =
    parseUserSearchFromParams(searchParams);

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
