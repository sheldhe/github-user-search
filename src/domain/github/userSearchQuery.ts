import type { UserSearchFilters } from "./userSearchFilters";

function quoteIfNeeded(v: string) {
  const t = v.trim();
  if (!t) return "";
  return /\s/.test(t) ? `"${t.replaceAll('"', '\\"')}"` : t;
}

function numRange(key: string, min?: number, max?: number) {
  const a =
    min != null && !Number.isNaN(min)
      ? Math.max(0, Math.floor(min))
      : undefined;
  const b =
    max != null && !Number.isNaN(max)
      ? Math.max(0, Math.floor(max))
      : undefined;

  if (a != null && b != null) return `${key}:${a}..${b}`;
  if (a != null) return `${key}:>=${a}`;
  if (b != null) return `${key}:<=${b}`;
  return "";
}

function dateRange(key: string, from?: string, to?: string) {
  if (from && to) return `${key}:${from}..${to}`;
  if (from) return `${key}:>=${from}`;
  if (to) return `${key}:<=${to}`;
  return "";
}

export function buildUserSearchQ(f: UserSearchFilters) {
  const parts: string[] = [];

  // 1) 사용자/조직만
  if (f.accountType === "user") parts.push("type:user");
  if (f.accountType === "org") parts.push("type:org");

  // 2) 계정/성명/메일
  const kw = f.keyword.trim();
  if (kw) parts.push(`in:${f.inField} ${kw}`);

  // 3) repos
  if (f.repos) {
    const q = numRange("repos", f.repos.min, f.repos.max);
    if (q) parts.push(q);
  }

  // 4) location
  if (f.location?.trim()) parts.push(`location:${quoteIfNeeded(f.location)}`);

  // 5) language
  if (f.language?.trim()) parts.push(`language:${quoteIfNeeded(f.language)}`);

  // 6) created
  if (f.created) {
    const q = dateRange("created", f.created.from, f.created.to);
    if (q) parts.push(q);
  }

  // 7) followers
  if (f.followers) {
    const q = numRange("followers", f.followers.min, f.followers.max);
    if (q) parts.push(q);
  }

  // 8) sponsorable
  if (f.sponsorable) parts.push("is:sponsorable");

  return parts.join(" ").trim();
}
