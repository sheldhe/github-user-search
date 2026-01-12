import { render, screen } from "@testing-library/react";
import UserSearchList from "@/src/features/user-search/components/UserSearchList";

jest.mock("@/src/shared/ui/AvatarCanvas", () => ({
  __esModule: true,
  default: ({ src }: any) => <div data-testid="avatar">{String(src)}</div>,
}));

describe("UserSearchList safety", () => {
  it("does not crash with unusual values", () => {
    render(
      <UserSearchList
        items={[
          {
            id: 1,
            login: "very-very-long-login-name-that-should-truncate",
            avatar_url: "",
            html_url: "https://github.com/u1",
            type: "User",
          },
        ]}
      />
    );

    expect(screen.getByText(/very-very-long-login/)).toBeInTheDocument();
    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });
});
