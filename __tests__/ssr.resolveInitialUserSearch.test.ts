import { resolveInitialUserSearch } from "@/src/domain/github/resolveInitialUserSearch";

describe("SSR boundary - resolveInitialUserSearch", () => {
  it("URL 파라미터를 기반으로 초기 사용자 검색 요청을 구성한다", () => {
    const r = resolveInitialUserSearch({
      keyword: "sheldhe",
      in: "login",
      type: "user",
      sort: "followers",
      order: "desc",
      perPage: "30",
    });

    expect(r.q).toContain("sheldhe");
    expect(r.q).toContain("in:login");
    expect(r.q).toContain("type:user");
    expect(r.sort).toBe("followers");
    expect(r.order).toBe("desc");
    expect(r.perPage).toBe(30);
  });
});
