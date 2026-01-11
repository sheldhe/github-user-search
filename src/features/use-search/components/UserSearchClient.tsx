"use client";

import type { UserSearchFilters } from "@/src/domain/github/userSearchFilters";
import type { SearchUsersApiResponse } from "../model/github.types";
import { DEFAULT_QUERY } from "@/src/domain/github/userSearchDefaults";

import { useUserSearchController } from "../hooks/useUserSearchController";

import UserSearchFilterPanel from "../components/UserSearchFilterPanel";
import UserSearchStatusBar from "../components/UserSearchStatusBar";
import UserSearchError from "../components/UserSearchError";
import UserSearchList from "../components/UserSearchList";
import UserSearchFooter from "../components/UserSearchFooter";

type Props = {
  initialQ: string;
  initialData: SearchUsersApiResponse;
  initialFilters: UserSearchFilters;
  initialSort: typeof DEFAULT_QUERY.sort;
  initialOrder: typeof DEFAULT_QUERY.order;
  initialPerPage: number;
};

export default function UserSearchClient(props: Props) {
  const c = useUserSearchController(props);

  return (
    <div className="min-h-dvh p-6 space-y-6">
      <UserSearchFilterPanel
        draft={c.draft}
        setDraft={c.setDraft}
        sort={c.sort}
        setSort={c.setSort}
        order={c.order}
        setOrder={c.setOrder}
        disabled={c.isFetching}
        onApply={c.apply}
        onReset={c.reset}
      />

      <UserSearchStatusBar
        q={c.q}
        remaining={c.rateLimit?.remaining}
        total={c.total}
      />

      <UserSearchError message={c.errorMsg} />

      <UserSearchList items={c.items} />

      <UserSearchFooter
        isFetching={c.isFetching}
        hasMore={c.hasMore}
        itemsLength={c.items.length}
        onLoadMore={c.loadMore}
        sentinelRef={c.sentinelRef}
      />
    </div>
  );
}
