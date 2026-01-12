"use client";

import AvatarCanvas from "@/src/shared/ui/AvatarCanvas";
import type { GitHubUserItem } from "../model/github.types";
import Chip from "@mui/material/Chip";

type Props = { items: GitHubUserItem[] };

export default function UserSearchList({ items }: Props) {
  return (
    <div className="grid gap-3">
      {items.map((u) => (
        <a
          key={u.id}
          data-cy="user-card"
          data-userid={u.id}
          href={u.html_url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded border p-3 hover:bg-black/5"
        >
          <AvatarCanvas src={u.avatar_url} size={40} ringColor="#0f4e8a" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-semibold truncate">{u.login}</div>
              <Chip size="small" label={u.type} />
            </div>
            <div className="text-xs opacity-70 truncate">{u.html_url}</div>
          </div>
        </a>
      ))}
    </div>
  );
}
