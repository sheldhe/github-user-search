import {
  parseUserSearchFromParams,
  toUserSearchParams,
} from "@/src/domain/github/userSearchUrl";
import { DEFAULT_QUERY } from "@/src/domain/github/userSearchDefaults";

describe("userSearchUrl", () => {
  it("URL 파라미터를 읽어 검색 필터를 생성하고 누락된 값은 기본값으로 채운다", () => {
    const sp = {
      keyword: "",
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

  it("기본 검색 설정값이 URL 파라미터에 올바르게 포함된다", () => {
    const params = toUserSearchParams(DEFAULT_QUERY.filters, {
      sort: DEFAULT_QUERY.sort,
      order: DEFAULT_QUERY.order,
      perPage: DEFAULT_QUERY.perPage,
    });
    expect(params.get("sort")).toBe(DEFAULT_QUERY.sort);
    expect(params.get("order")).toBe(DEFAULT_QUERY.order);
    expect(params.get("perPage")).toBe(String(DEFAULT_QUERY.perPage));
  });
});
