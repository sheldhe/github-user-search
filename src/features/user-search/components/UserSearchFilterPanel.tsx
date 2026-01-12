"use client";

import * as React from "react";
import type { UserSearchFilters } from "@/src/domain/github/userSearchFilters";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import type { DEFAULT_QUERY } from "@/src/domain/github/userSearchDefaults";

type Props = {
  draft: UserSearchFilters;
  setDraft: React.Dispatch<React.SetStateAction<UserSearchFilters>>;

  sort: typeof DEFAULT_QUERY.sort;
  setSort: (v: any) => void;

  order: typeof DEFAULT_QUERY.order;
  setOrder: (v: any) => void;

  disabled?: boolean;
  onApply: () => void;
  onReset: () => void;
};

export default function UserSearchFilterPanel({
  draft,
  setDraft,
  sort,
  setSort,
  order,
  setOrder,
  disabled,
  onApply,
  onReset,
}: Props) {
  const applyDisabled = disabled || draft.keyword === "";
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      <TextField
        label="Keyword"
        size="small"
        value={draft.keyword}
        onChange={(e) => setDraft((p) => ({ ...p, keyword: e.target.value }))}
      />

      <TextField
        select
        label="Search In"
        size="small"
        value={draft.inField}
        onChange={(e) =>
          setDraft((p) => ({ ...p, inField: e.target.value as any }))
        }
      >
        <MenuItem value="login">login</MenuItem>
        <MenuItem value="name">name</MenuItem>
        <MenuItem value="email">email</MenuItem>
      </TextField>
      <TextField
        select
        label="Type"
        size="small"
        value={draft.accountType}
        onChange={(e) =>
          setDraft((p) => ({ ...p, accountType: e.target.value as any }))
        }
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="user">User only</MenuItem>
        <MenuItem value="org">Org only</MenuItem>
      </TextField>

      <TextField
        select
        label="Sponsorable"
        size="small"
        value={draft.sponsorable ? "yes" : "no"}
        onChange={(e) =>
          setDraft((p) => ({ ...p, sponsorable: e.target.value === "yes" }))
        }
      >
        <MenuItem value="no">No</MenuItem>
        <MenuItem value="yes">Yes (is:sponsorable)</MenuItem>
      </TextField>

      <TextField
        label="Location"
        size="small"
        value={draft.location ?? ""}
        onChange={(e) => setDraft((p) => ({ ...p, location: e.target.value }))}
      />

      <TextField
        label="Language"
        size="small"
        value={draft.language ?? ""}
        onChange={(e) => setDraft((p) => ({ ...p, language: e.target.value }))}
      />

      <TextField
        label="Repos Min"
        type="number"
        size="small"
        value={draft.repos?.min ?? ""}
        onChange={(e) =>
          setDraft((p) => ({
            ...p,
            repos: {
              ...(p.repos ?? {}),
              min: e.target.value ? Number(e.target.value) : undefined,
            },
          }))
        }
      />
      <TextField
        label="Repos Max"
        type="number"
        size="small"
        value={draft.repos?.max ?? ""}
        onChange={(e) =>
          setDraft((p) => ({
            ...p,
            repos: {
              ...(p.repos ?? {}),
              max: e.target.value ? Number(e.target.value) : undefined,
            },
          }))
        }
      />

      <TextField
        label="Followers Min"
        type="number"
        size="small"
        value={draft.followers?.min ?? ""}
        onChange={(e) =>
          setDraft((p) => ({
            ...p,
            followers: {
              ...(p.followers ?? {}),
              min: e.target.value ? Number(e.target.value) : undefined,
            },
          }))
        }
      />
      <TextField
        label="Followers Max"
        type="number"
        size="small"
        value={draft.followers?.max ?? ""}
        onChange={(e) =>
          setDraft((p) => ({
            ...p,
            followers: {
              ...(p.followers ?? {}),
              max: e.target.value ? Number(e.target.value) : undefined,
            },
          }))
        }
      />

      <TextField
        label="Created From"
        type="date"
        size="small"
        value={draft.created?.from ?? ""}
        onChange={(e) =>
          setDraft((p) => ({
            ...p,
            created: {
              ...(p.created ?? {}),
              from: e.target.value || undefined,
            },
          }))
        }
      />
      <TextField
        label="Created To"
        type="date"
        size="small"
        value={draft.created?.to ?? ""}
        onChange={(e) =>
          setDraft((p) => ({
            ...p,
            created: { ...(p.created ?? {}), to: e.target.value || undefined },
          }))
        }
      />

      <TextField
        select
        label="Sort"
        size="small"
        value={sort}
        onChange={(e) => setSort(e.target.value as any)}
      >
        <MenuItem value="followers">followers</MenuItem>
        <MenuItem value="repositories">repositories</MenuItem>
        <MenuItem value="joined">joined</MenuItem>
      </TextField>

      <TextField
        select
        label="Order"
        size="small"
        value={order}
        onChange={(e) => setOrder(e.target.value as any)}
      >
        <MenuItem value="desc">DESC</MenuItem>
        <MenuItem value="asc">ASC</MenuItem>
      </TextField>

      <div className="flex gap-2 items-center">
        <Button variant="contained" onClick={onApply} disabled={applyDisabled}>
          Apply
        </Button>
        <Button variant="outlined" onClick={onReset} disabled={disabled}>
          Reset
        </Button>
      </div>
    </div>
  );
}
