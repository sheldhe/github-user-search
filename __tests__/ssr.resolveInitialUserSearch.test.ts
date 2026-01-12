import { resolveInitialUserSearch } from "@/src/domain/github/resolveInitialUserSearch";

describe("SSR boundary - resolveInitialUserSearch", () => {
  it("builds initial request from URL params", () => {
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
