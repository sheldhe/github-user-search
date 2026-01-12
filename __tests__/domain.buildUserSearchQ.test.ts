import { buildUserSearchQ } from "@/src/domain/github/userSearchQuery";
import type { UserSearchFilters } from "@/src/domain/github/userSearchFilters";

describe("buildUserSearchQ", () => {
  it("모든 필터가 주어졌을 때 GitHub 사용자 검색 쿼리를 생성한다", () => {
    const filters: UserSearchFilters = {
      accountType: "user",
      keyword: "sheldhe",
      inField: "login",
      repos: { min: 10, max: 200 },
      location: "seoul",
      language: "typescript",
      created: { from: "2020-01-01", to: "2024-12-31" },
      followers: { min: 5, max: 1000 },
      sponsorable: true,
    };

    const q = buildUserSearchQ(filters)!;

    expect(q).toContain("sheldhe");
    expect(q).toContain("in:login");
    expect(q).toContain("type:user");
    expect(q).toContain("repos:");
    expect(q).toContain("location:seoul");
    expect(q).toContain("language:typescript");
    expect(q).toContain("created:");
    expect(q).toContain("followers:");
    expect(q).toContain("is:sponsorable");
  });

  it("검색에 사용할 수 있는 필터가 하나도 없으면 빈 문자열을 반환한다", () => {
    const filters: UserSearchFilters = {
      accountType: "all",
      keyword: "",
      inField: "login",
      repos: {},
      location: "",
      language: "",
      created: {},
      followers: {},
      sponsorable: false,
    };

    const q = buildUserSearchQ(filters);
    expect(q).toBe("");
  });

  it("accountType이 all이면 type:user 또는 type:org 조건을 추가하지 않는다", () => {
    const filters: UserSearchFilters = {
      accountType: "all",
      keyword: "abc",
      inField: "login",
      repos: {},
      location: "",
      language: "",
      created: {},
      followers: {},
      sponsorable: false,
    };

    const q = buildUserSearchQ(filters)!;

    expect(q).not.toContain("type:user");
    expect(q).not.toContain("type:org");
  });
});
