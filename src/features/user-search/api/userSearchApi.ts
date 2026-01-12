import { baseApi } from "@/src/shared/api/baseApi";
import { SearchUsersApiResponse } from "../model/github.types";
import { SearchUsersArgs } from "../model/search.args";

export const userSearchApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    searchUsers: build.query<SearchUsersApiResponse, SearchUsersArgs>({
      query: ({ q, page, perPage, sort, order }) => ({
        url: "/api/github/search/users",
        params: {
          q,
          page,
          per_page: perPage,
          sort,
          order,
        },
      }),
    }),
  }),
});

export const { useLazySearchUsersQuery } = userSearchApi;
