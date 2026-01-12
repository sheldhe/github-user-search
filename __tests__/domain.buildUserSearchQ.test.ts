import { buildUserSearchQ } from "@/src/domain/github/userSearchQuery";
import type { UserSearchFilters } from "@/src/domain/github/userSearchFilters";

//검색 쿼리(buildUserSearchQ) 단위 테스트
describe("buildUserSearchQ", () => {
  it("builds query with all required qualifiers", () => {
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

    // 핵심: 포함 여부만 체크 (문자열 전체 동등비교는 유지보수 어려움)
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

  it("returns empty when too broad (prevents rate-limit) - optional rule", () => {
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

  it("does not add type qualifier when accountType is all", () => {
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
