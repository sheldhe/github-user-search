import { renderHook, act } from "@testing-library/react";
import { DEFAULT_QUERY } from "@/src/domain/github/userSearchDefaults";
import { useUserSearchController } from "@/src/features/user-search/hooks/useUserSearchController";

const mockTrigger = jest.fn();

jest.mock("@/src/features/user-search/api/userSearchApi", () => ({
  useLazySearchUsersQuery: () => [
    mockTrigger,
    { isFetching: false, data: undefined, error: undefined },
  ],
}));

beforeEach(() => {
  mockTrigger.mockImplementation(() =>
    Promise.resolve({
      unwrap: () => Promise.resolve(okPage()),
    })
  );
});

function okPage(itemsCount = 2, total = 50) {
  return {
    ok: true as const,
    data: {
      total_count: total,
      incomplete_results: false,
      items: Array.from({ length: itemsCount }).map((_, i) => ({
        id: i + 1,
        login: `u${i + 1}`,
        avatar_url: "https://example.com/a.png",
        html_url: "https://github.com/u",
        type: "User" as const,
      })),
    },
    rateLimit: { remaining: 42 },
  };
}

describe("useUserSearch integration", () => {
  beforeEach(() => {
    mockTrigger.mockReset();
    mockTrigger.mockResolvedValue({ unwrap: async () => okPage() });
  });

  it("calls fetch with page=1 and respects sort/order", async () => {
    const { result } = renderHook(() =>
      useUserSearchController({
        initialQ: "in:login sheldhe type:user",
        initialData: okPage(),
        initialFilters: DEFAULT_QUERY.filters,
        initialSort: "followers",
        initialOrder: "desc",
        initialPerPage: 30,
      })
    );

    await act(async () => {
      await result.current.apply();
    });

    // apply()가 buildUserSearchQ 성공 → trigger 호출
    expect(mockTrigger).toHaveBeenCalled();
    const callArgs = mockTrigger.mock.calls.at(-1)![0];
    expect(callArgs.page).toBe(1);
    expect(callArgs.perPage).toBe(30);
    expect(callArgs.sort).toBe("followers");
    expect(callArgs.order).toBe("desc");
  });

  it("loadMore increments page and appends (paging logic)", async () => {
    const { result } = renderHook(() =>
      useUserSearchController({
        initialQ: "in:login sheldhe type:user",
        initialData: okPage(30, 100),
        initialFilters: DEFAULT_QUERY.filters,
        initialSort: "followers",
        initialOrder: "desc",
        initialPerPage: 30,
      })
    );

    await act(async () => {
      await result.current.loadMore();
    });

    const callArgs = mockTrigger.mock.calls.at(-1)![0];
    expect(callArgs.page).toBe(2);
  });
});
