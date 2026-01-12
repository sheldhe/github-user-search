import { searchUsers } from "@/src/server/github/searchUsers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const perPage = Math.min(Number(searchParams.get("per_page") ?? "30"), 100);

  const sort = (searchParams.get("sort") ?? undefined) as
    | "followers"
    | "repositories"
    | "joined"
    | undefined;

  const order = (searchParams.get("order") ?? undefined) as
    | "asc"
    | "desc"
    | undefined;

  const result = await searchUsers({ q, page, perPage, sort, order });
  return NextResponse.json(result, { status: 200 });
}
