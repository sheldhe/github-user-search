import type { UserSearchFilters } from "./userSearchFilters";

export const DEFAULT_FILTERS: UserSearchFilters = {
  accountType: "user",
  keyword: "",
  inField: "login",
  repos: {},
  location: "",
  language: "",
  created: {},
  followers: {},
  sponsorable: false,
};

export const DEFAULT_PAGE = 1 as const;
export const DEFAULT_PER_PAGE = 30 as const;
export const DEFAULT_SORT = "followers" as const;
export const DEFAULT_ORDER = "desc" as const;

export const DEFAULT_QUERY = {
  filters: DEFAULT_FILTERS,
  page: DEFAULT_PAGE,
  perPage: DEFAULT_PER_PAGE,
  sort: DEFAULT_SORT,
  order: DEFAULT_ORDER,
} as const;
