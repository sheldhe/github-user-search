import {
  parseUserSearchFromParams,
  toUserSearchParams,
} from "@/src/domain/github/userSearchUrl";
import { DEFAULT_QUERY } from "@/src/domain/github/userSearchDefaults";

describe("userSearchUrl", () => {
  it("parseUserSearchFromParams fills defaults & reads params", () => {
    const sp = {
      keyword: "sheldhe",
      in: "login",
      type: "user",
      sort: "followers",
      order: "desc",
      perPage: "30",
      location: "seoul",
      language: "typescript",
      reposMin: "10",
      followersMin: "5",
      sponsorable: "1",
    };

    const parsed = parseUserSearchFromParams(sp);

    expect(parsed.filters.keyword).toBe("sheldhe");
    expect(parsed.filters.inField).toBe("login");
    expect(parsed.filters.accountType).toBe("user");

    expect(parsed.sort).toBe("followers");
    expect(parsed.order).toBe("desc");
    expect(parsed.perPage).toBe(30);

    expect(parsed.filters.location).toBe("seoul");
    expect(parsed.filters.language).toBe("typescript");
    expect(parsed.filters.repos?.min).toBe(10);
    expect(parsed.filters.followers?.min).toBe(5);
    expect(parsed.filters.sponsorable).toBe(true);
  });

  it("toUserSearchParams makes stable url params", () => {
    const params = toUserSearchParams(DEFAULT_QUERY.filters, {
      sort: DEFAULT_QUERY.sort,
      order: DEFAULT_QUERY.order,
      perPage: DEFAULT_QUERY.perPage,
    });

    // 최소한 기본 키는 들어가게(너 정책에 따라 조정)
    expect(params.get("sort")).toBe(DEFAULT_QUERY.sort);
    expect(params.get("order")).toBe(DEFAULT_QUERY.order);
    expect(params.get("perPage")).toBe(String(DEFAULT_QUERY.perPage));
  });
});
