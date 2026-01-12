import { DEFAULT_QUERY } from "@/src/domain/github/userSearchDefaults";
import { buildUserSearchQ } from "@/src/domain/github/userSearchQuery";
import UserSearchClient from "@/src/features/user-search/components/UserSearchClient";
import { SearchUsersApiResponse } from "@/src/features/user-search/model/github.types";

describe("<UserSearchClient />", () => {
  it("renders initial users", () => {
    const q = buildUserSearchQ(DEFAULT_QUERY.filters) || "type:user"; // q가 비면 안 되니까 fallback

    const initialData: SearchUsersApiResponse = {
      ok: true,
      data: {
        total_count: 1,
        incomplete_results: false,
        items: [
          {
            id: 1,
            login: "octocat",
            avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
            html_url: "https://github.com/octocat",
            type: "User",
          },
        ],
      },
      rateLimit: {
        limit: 10,
        remaining: 9,
        reset: Math.floor(Date.now() / 1000) + 60,
      },
    };
    cy.mount(
      <UserSearchClient
        initialQ={q}
        initialData={initialData}
        initialFilters={DEFAULT_QUERY.filters}
        initialSort={DEFAULT_QUERY.sort}
        initialOrder={DEFAULT_QUERY.order}
        initialPerPage={DEFAULT_QUERY.perPage}
      />
    );

    cy.contains("octocat").should("be.visible");
  });
});
