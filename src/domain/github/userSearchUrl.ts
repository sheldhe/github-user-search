import { DEFAULT_QUERY } from "./userSearchDefaults";
import type { UserSearchFilters } from "./userSearchFilters";

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

const toStr = (v: string | string[] | undefined) => first(v) ?? "";
const toNum = (v: string | string[] | undefined) => {
  const s = toStr(v);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
};
const toBool = (v: string | string[] | undefined) => {
  const s = toStr(v).toLowerCase();
  if (!s) return undefined;
  return s === "1" || s === "true" || s === "yes" || s === "on";
};

export function parseUserSearchFromParams(
  sp: Record<string, string | string[] | undefined>
) {
  // 2) keyword + inField
  const keyword = toStr(sp.keyword) || DEFAULT_QUERY.filters.keyword;

  const inField = (toStr(sp.in) ||
    DEFAULT_QUERY.filters.inField) as UserSearchFilters["inField"];

  // 1) user/org
  const accountType = (toStr(sp.type) ||
    DEFAULT_QUERY.filters.accountType) as UserSearchFilters["accountType"];

  // 3) repos range
  const reposMin = toNum(sp.reposMin);
  const reposMax = toNum(sp.reposMax);

  // 4) location
  const location = toStr(sp.location) || DEFAULT_QUERY.filters.location || "";

  // 5) language
  const language = toStr(sp.language) || DEFAULT_QUERY.filters.language || "";

  // 6) created range (YYYY-MM-DD)
  const createdFrom =
    toStr(sp.createdFrom) || DEFAULT_QUERY.filters.created?.from || "";
  const createdTo =
    toStr(sp.createdTo) || DEFAULT_QUERY.filters.created?.to || "";

  // 7) followers range
  const followersMin = toNum(sp.followersMin);
  const followersMax = toNum(sp.followersMax);

  // 8) sponsorable
  const sponsorable =
    toBool(sp.sponsorable) ?? DEFAULT_QUERY.filters.sponsorable ?? false;

  // sort/order/page/perPage
  const sort = (toStr(sp.sort) ||
    DEFAULT_QUERY.sort) as typeof DEFAULT_QUERY.sort;

  const order = (toStr(sp.order) ||
    DEFAULT_QUERY.order) as typeof DEFAULT_QUERY.order;

  // const page = toNum(sp.page) ?? DEFAULT_QUERY.page;

  const perPage = Math.min(toNum(sp.perPage) ?? DEFAULT_QUERY.perPage, 100);

  const filters: UserSearchFilters = {
    ...DEFAULT_QUERY.filters,
    keyword,
    inField,
    accountType,

    location: location || undefined,
    language: language || undefined,

    repos:
      reposMin != null || reposMax != null
        ? { min: reposMin, max: reposMax }
        : DEFAULT_QUERY.filters.repos ?? {},

    followers:
      followersMin != null || followersMax != null
        ? { min: followersMin, max: followersMax }
        : DEFAULT_QUERY.filters.followers ?? {},

    created:
      createdFrom || createdTo
        ? { from: createdFrom || undefined, to: createdTo || undefined }
        : DEFAULT_QUERY.filters.created ?? {},

    sponsorable,
  };

  return { filters, sort, order, perPage };
}

// export function filtersToSearchParams(
//   filters: UserSearchFilters,
//   extra?: {
//     sort?: string;
//     order?: string;
//     perPage?: number;
//   }
// ) {
//   const p = new URLSearchParams();

//   // 필수/기본
//   if (filters.keyword) p.set("keyword", filters.keyword);
//   if (filters.inField) p.set("in", filters.inField);
//   if (filters.accountType) p.set("type", filters.accountType);

//   // 3 repos
//   if (filters.repos?.min != null) p.set("reposMin", String(filters.repos.min));
//   if (filters.repos?.max != null) p.set("reposMax", String(filters.repos.max));

//   // 4 location
//   if (filters.location) p.set("location", filters.location);

//   // 5 language
//   if (filters.language) p.set("language", filters.language);

//   // 6 created
//   if (filters.created?.from) p.set("createdFrom", filters.created.from);
//   if (filters.created?.to) p.set("createdTo", filters.created.to);

//   // 7 followers
//   if (filters.followers?.min != null)
//     p.set("followersMin", String(filters.followers.min));
//   if (filters.followers?.max != null)
//     p.set("followersMax", String(filters.followers.max));

//   // 8 sponsorable
//   if (filters.sponsorable) p.set("sponsorable", "1");

//   // sort/order/perPage
//   if (extra?.sort) p.set("sort", extra.sort);
//   if (extra?.order) p.set("order", extra.order);
//   if (extra?.perPage) p.set("perPage", String(extra.perPage));

//   return p;
// }

export function toUserSearchParams(
  filters: UserSearchFilters,
  extra: { sort: string; order: string; perPage: number }
) {
  const p = new URLSearchParams();

  if (filters.keyword) p.set("keyword", filters.keyword);
  if (filters.inField) p.set("in", filters.inField);
  if (filters.accountType) p.set("type", filters.accountType);

  if (filters.location) p.set("location", filters.location);
  if (filters.language) p.set("language", filters.language);

  if (filters.repos?.min != null) p.set("reposMin", String(filters.repos.min));
  if (filters.repos?.max != null) p.set("reposMax", String(filters.repos.max));

  if (filters.followers?.min != null)
    p.set("followersMin", String(filters.followers.min));
  if (filters.followers?.max != null)
    p.set("followersMax", String(filters.followers.max));

  if (filters.created?.from) p.set("createdFrom", filters.created.from);
  if (filters.created?.to) p.set("createdTo", filters.created.to);

  if (filters.sponsorable) p.set("sponsorable", "1");

  p.set("sort", extra.sort);
  p.set("order", extra.order);
  p.set("perPage", String(extra.perPage));

  return p;
}
