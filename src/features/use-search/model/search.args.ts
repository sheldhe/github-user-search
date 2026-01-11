export type SortKey = "best" | "followers" | "repositories" | "joined";
export type OrderKey = "asc" | "desc";

export type SearchUsersArgs = {
  q: string;
  page: number;
  perPage: number;
  sort?: Exclude<SortKey, "best">;
  order?: OrderKey;
};
