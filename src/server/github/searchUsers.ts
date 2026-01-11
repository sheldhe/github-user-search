import { SearchUsersApiResponse } from "@/src/features/use-search/model/github.types";
import { OrderKey } from "@/src/features/use-search/model/search.args";

function readRateLimit(res: Response) {
  const limit = res.headers.get("x-ratelimit-limit");
  const remaining = res.headers.get("x-ratelimit-remaining");
  const reset = res.headers.get("x-ratelimit-reset");
  return {
    limit: limit ? Number(limit) : undefined,
    remaining: remaining ? Number(remaining) : undefined,
    reset: reset ? Number(reset) : undefined,
  };
}

export async function searchUsers(params: {
  q: string;
  page: number;
  perPage: number;
  sort?: "followers" | "repositories" | "joined";
  order?: OrderKey;
}): Promise<SearchUsersApiResponse> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return {
      ok: false,
      error: { status: 500, message: "Missing GITHUB_TOKEN" },
    };
  }

  const url = new URL("https://api.github.com/search/users");
  url.searchParams.set("q", params.q);
  url.searchParams.set("page", String(params.page));
  url.searchParams.set("per_page", String(params.perPage));
  if (params.sort) url.searchParams.set("sort", params.sort);
  if (params.order) url.searchParams.set("order", params.order);

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const rateLimit = readRateLimit(res);

  if (!res.ok) {
    let message = `GitHub API Error (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {}
    return { ok: false, error: { status: res.status, message }, rateLimit };
  }

  const data = (await res.json()) as any;
  return { ok: true, data, rateLimit };
}
