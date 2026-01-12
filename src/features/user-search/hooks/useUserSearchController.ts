"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import type { UserSearchFilters } from "@/src/domain/github/userSearchFilters";
import { buildUserSearchQ } from "@/src/domain/github/userSearchQuery";
import { toUserSearchParams } from "@/src/domain/github/userSearchUrl";

import type {
  GitHubUserItem,
  SearchUsersApiResponse,
} from "../model/github.types";
import { useLazySearchUsersQuery } from "../api/userSearchApi";
import { DEFAULT_QUERY } from "@/src/domain/github/userSearchDefaults";

type Args = {
  initialQ: string;
  initialData: SearchUsersApiResponse;

  initialFilters: UserSearchFilters;
  initialSort: typeof DEFAULT_QUERY.sort;
  initialOrder: typeof DEFAULT_QUERY.order;
  initialPerPage: number;
};

export function useUserSearchController({
  initialQ,
  initialData,
  initialFilters,
  initialSort,
  initialOrder,
  initialPerPage,
}: Args) {
  const pathname = usePathname();
  const [trigger, queryState] = useLazySearchUsersQuery();

  const initialItems: GitHubUserItem[] = initialData.ok
    ? initialData.data.items
    : [];
  const initialTotal = initialData.ok ? initialData.data.total_count : 0;
  const initialError = !initialData.ok ? initialData.error.message : "";

  const PER_PAGE = initialPerPage;

  const [draft, setDraft] = React.useState<UserSearchFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    React.useState<UserSearchFilters>(initialFilters);

  const appliedRef = React.useRef(appliedFilters);
  React.useEffect(() => {
    appliedRef.current = appliedFilters;
  }, [appliedFilters]);

  const [sort, setSort] =
    React.useState<typeof DEFAULT_QUERY.sort>(initialSort);
  const [order, setOrder] =
    React.useState<typeof DEFAULT_QUERY.order>(initialOrder);

  const [page, setPage] = React.useState<number>(1);
  const [q, setQ] = React.useState<string>(initialQ);

  const qRef = React.useRef(q);
  React.useEffect(() => {
    qRef.current = q;
  }, [q]);

  const [items, setItems] = React.useState<GitHubUserItem[]>(initialItems);
  const [total, setTotal] = React.useState<number>(initialTotal);
  const [hasMore, setHasMore] = React.useState<boolean>(
    initialItems.length < initialTotal
  );
  const [errorMsg, setErrorMsg] = React.useState<string>(initialError);

  const rateLimit = queryState.data?.rateLimit ?? initialData.rateLimit;

  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const loadingMoreRef = React.useRef(false);

  const replaceUrl = React.useCallback(
    (params: URLSearchParams) => {
      if (typeof window === "undefined") return;
      const url = new URL(window.location.href);
      url.pathname = pathname;
      url.search = params.toString();
      window.history.replaceState(null, "", url.toString());
    },
    [pathname]
  );

  const isTooBroad = React.useCallback((f: UserSearchFilters) => {
    const hasKeyword = (f.keyword ?? "").trim().length > 0;
    const hasLocation = (f.location ?? "").trim().length > 0;
    const hasLanguage = (f.language ?? "").trim().length > 0;

    const hasRepos = f.repos?.min != null || f.repos?.max != null;
    const hasFollowers = f.followers?.min != null || f.followers?.max != null;

    const hasCreated =
      (f.created?.from ?? "").trim().length > 0 ||
      (f.created?.to ?? "").trim().length > 0;

    const hasSponsorable = !!f.sponsorable;

    return !(
      hasKeyword ||
      hasLocation ||
      hasLanguage ||
      hasRepos ||
      hasFollowers ||
      hasCreated ||
      hasSponsorable
    );
  }, []);

  const doFetchPage = React.useCallback(
    async (nextQ: string, nextPage: number, mode: "replace" | "append") => {
      const res = await trigger(
        { q: nextQ, page: nextPage, perPage: PER_PAGE, sort, order },
        false
      );

      const data = (res as any)?.data;
      const error = (res as any)?.error;

      if (!data?.ok) {
        setErrorMsg(error?.message ?? "Unknown error");
        setHasMore(false);
        return false;
      }

      const nextItems = data.data.items;
      const nextTotal = data.data.total_count;

      setTotal(nextTotal);
      setPage(nextPage);

      if (mode === "replace") {
        setItems(nextItems);
        setHasMore(nextItems.length < nextTotal);
        return true;
      }

      setItems((prev) => {
        const map = new Map(prev.map((u) => [u.id, u]));
        for (const u of nextItems) map.set(u.id, u);
        const merged = Array.from(map.values());
        setHasMore(merged.length < nextTotal);
        return merged;
      });

      return true;
    },
    [PER_PAGE, order, sort, trigger]
  );

  const apply = React.useCallback(async () => {
    setErrorMsg("");

    if (isTooBroad(draft)) {
      setErrorMsg("키워드 없이 검색불가합니다.");
      return;
    }

    const nextQ = buildUserSearchQ(draft);
    if (!nextQ) {
      setErrorMsg("키워드/조건을 입력해주세요.");
      setItems([]);
      setTotal(0);
      setHasMore(false);
      return;
    }

    setAppliedFilters(draft);
    appliedRef.current = draft;

    replaceUrl(toUserSearchParams(draft, { sort, order, perPage: PER_PAGE }));

    setQ(nextQ);
    setPage(1);
    setItems([]);
    setTotal(0);
    setHasMore(true);

    await doFetchPage(nextQ, 1, "replace");
  }, [PER_PAGE, doFetchPage, draft, isTooBroad, order, replaceUrl, sort]);

  const reset = React.useCallback(() => {
    setErrorMsg("");

    setDraft(initialFilters);
    setAppliedFilters(initialFilters);
    appliedRef.current = initialFilters;

    setSort(initialSort);
    setOrder(initialOrder);

    replaceUrl(
      toUserSearchParams(initialFilters, {
        sort: initialSort,
        order: initialOrder,
        perPage: PER_PAGE,
      })
    );

    setQ(initialQ);
    setPage(1);
    setItems(initialItems);
    setTotal(initialTotal);
    setHasMore(initialItems.length < initialTotal);
  }, [
    PER_PAGE,
    initialFilters,
    initialItems,
    initialOrder,
    initialQ,
    initialSort,
    initialTotal,
    replaceUrl,
  ]);

  const loadMore = React.useCallback(async () => {
    if (!hasMore) return;
    if (queryState.isFetching) return;
    if (loadingMoreRef.current) return;
    if (isTooBroad(appliedRef.current)) return;

    loadingMoreRef.current = true;
    try {
      await doFetchPage(qRef.current, page + 1, "append");
    } finally {
      loadingMoreRef.current = false;
    }
  }, [doFetchPage, hasMore, isTooBroad, page, queryState.isFetching]);

  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (!hasMore) return;
        if (queryState.isFetching) return;
        if (loadingMoreRef.current) return;
        loadMore();
      },
      { rootMargin: "250px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loadMore, queryState.isFetching]);

  // 정렬만 바꿔도 재조회되게
  React.useEffect(() => {
    const currentQ = qRef.current;
    if (!currentQ) return;

    const currentFilters = appliedRef.current;
    if (isTooBroad(currentFilters)) return;

    setErrorMsg("");
    setItems([]);
    setTotal(0);
    setHasMore(true);
    setPage(1);

    replaceUrl(
      toUserSearchParams(currentFilters, { sort, order, perPage: PER_PAGE })
    );
    doFetchPage(currentQ, 1, "replace");
  }, [PER_PAGE, doFetchPage, isTooBroad, order, replaceUrl, sort]);

  return {
    // state
    draft,
    sort,
    order,
    q,
    items,
    total,
    hasMore,
    errorMsg,
    rateLimit,
    isFetching: queryState.isFetching,

    // refs
    sentinelRef,

    // actions
    setDraft,
    setSort,
    setOrder,
    apply,
    reset,
    loadMore,
  };
}
