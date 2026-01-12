export type GitHubUserType = "User" | "Organization";

export type GitHubUserItem = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: GitHubUserType;
};

export type GitHubSearchUsersResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubUserItem[];
};

export type RateLimitInfo = {
  limit?: number;
  remaining?: number;
  reset?: number;
};

export type ApiError = {
  status: number;
  message: string;
};

export type SearchUsersApiResponse =
  | { ok: true; data: GitHubSearchUsersResponse; rateLimit?: RateLimitInfo }
  | { ok: false; error: ApiError; rateLimit?: RateLimitInfo };
