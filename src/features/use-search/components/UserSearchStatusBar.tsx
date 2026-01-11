"use client";

import Chip from "@mui/material/Chip";

type Props = {
  q: string;
  remaining?: number;
  total: number;
};

export default function UserSearchStatusBar({ q, remaining, total }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs opacity-80">
      <Chip size="small" label={`q: ${q || "(empty)"}`} />
      {remaining != null && (
        <Chip size="small" label={`Remaining: ${remaining}`} />
      )}
      {total ? (
        <Chip size="small" label={`Total: ${total.toLocaleString()}`} />
      ) : null}
    </div>
  );
}
