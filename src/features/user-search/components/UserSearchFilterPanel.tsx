"use client";

import * as React from "react";
import type { UserSearchFilters } from "@/src/domain/github/userSearchFilters";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

type SortKey = "followers" | "repositories" | "joined";
type OrderKey = "asc" | "desc";

type Props = {
  draft: UserSearchFilters;
  setDraft: React.Dispatch<React.SetStateAction<UserSearchFilters>>;

  sort: SortKey;
  setSort: (v: SortKey) => void;

  order: OrderKey;
  setOrder: (v: OrderKey) => void;

  disabled?: boolean;
  onApply: () => void;
  onReset: () => void;
  onLoadMore: () => void;
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
  onLoadMore,
}: Props) {
  const applyDisabled = disabled || draft.keyword.trim() === "";

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
      data-cy="filter-panel"
    >
      {/* Keyword */}
      <TextField
        label="Keyword"
        size="small"
        value={draft.keyword}
        inputProps={{ "data-cy": "keyword" }}
        onChange={(e) => setDraft((p) => ({ ...p, keyword: e.target.value }))}
      />

      {/* Search In (select) */}
      <TextField
        select
        label="Search In"
        size="small"
        value={draft.inField}
        onChange={(e) =>
          setDraft((p) => ({ ...p, inField: e.target.value as any }))
        }
        SelectProps={{
          inputProps: { "data-cy": "inField-select" },
          MenuProps: {
            PaperProps: { "data-cy": "inField-menu" } as any,
          },
        }}
      >
        <MenuItem value="login" data-cy="inField-login">
          login
        </MenuItem>
        <MenuItem value="name" data-cy="inField-name">
          name
        </MenuItem>
        <MenuItem value="email" data-cy="inField-email">
          email
        </MenuItem>
      </TextField>

      {/* Type (select) */}
      <TextField
        select
        label="Type"
        size="small"
        value={draft.accountType}
        onChange={(e) =>
          setDraft((p) => ({ ...p, accountType: e.target.value as any }))
        }
        SelectProps={{
          inputProps: { "data-cy": "accountType-select" },
          MenuProps: { PaperProps: { "data-cy": "accountType-menu" } as any },
        }}
      >
        <MenuItem value="all" data-cy="accountType-all">
          All
        </MenuItem>
        <MenuItem value="user" data-cy="accountType-user">
          User only
        </MenuItem>
        <MenuItem value="org" data-cy="accountType-org">
          Org only
        </MenuItem>
      </TextField>

      {/* Sponsorable (select) */}
      <TextField
        select
        label="Sponsorable"
        size="small"
        value={draft.sponsorable ? "yes" : "no"}
        onChange={(e) =>
          setDraft((p) => ({ ...p, sponsorable: e.target.value === "yes" }))
        }
        SelectProps={{
          inputProps: { "data-cy": "sponsorable-select" },
          MenuProps: { PaperProps: { "data-cy": "sponsorable-menu" } as any },
        }}
      >
        <MenuItem value="no" data-cy="sponsorable-no">
          No
        </MenuItem>
        <MenuItem value="yes" data-cy="sponsorable-yes">
          Yes (is:sponsorable)
        </MenuItem>
      </TextField>

      {/* Location */}
      <TextField
        label="Location"
        size="small"
        value={draft.location ?? ""}
        inputProps={{ "data-cy": "location" }}
        onChange={(e) => setDraft((p) => ({ ...p, location: e.target.value }))}
      />

      {/* Language */}
      <TextField
        label="Language"
        size="small"
        value={draft.language ?? ""}
        inputProps={{ "data-cy": "language" }}
        onChange={(e) => setDraft((p) => ({ ...p, language: e.target.value }))}
      />

      {/* Repos min/max */}
      <TextField
        label="Repos Min"
        type="number"
        size="small"
        value={draft.repos?.min ?? ""}
        inputProps={{ "data-cy": "repos-min" }}
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
        inputProps={{ "data-cy": "repos-max" }}
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

      {/* Followers min/max */}
      <TextField
        label="Followers Min"
        type="number"
        size="small"
        value={draft.followers?.min ?? ""}
        inputProps={{ "data-cy": "followers-min" }}
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
        inputProps={{ "data-cy": "followers-max" }}
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

      {/* Created from/to */}
      <TextField
        label="Created From"
        type="date"
        size="small"
        InputLabelProps={{ shrink: true }}
        value={draft.created?.from ?? ""}
        inputProps={{ "data-cy": "created-from" }}
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
        InputLabelProps={{ shrink: true }}
        value={draft.created?.to ?? ""}
        inputProps={{ "data-cy": "created-to" }}
        onChange={(e) =>
          setDraft((p) => ({
            ...p,
            created: { ...(p.created ?? {}), to: e.target.value || undefined },
          }))
        }
      />

      {/* Sort (select) */}
      <TextField
        select
        label="Sort"
        size="small"
        value={sort}
        onChange={(e) => setSort(e.target.value as SortKey)}
        SelectProps={{
          inputProps: { "data-cy": "sort-select" },
          MenuProps: { PaperProps: { "data-cy": "sort-menu" } as any },
        }}
      >
        <MenuItem value="followers" data-cy="sort-followers">
          followers
        </MenuItem>
        <MenuItem value="repositories" data-cy="sort-repositories">
          repositories
        </MenuItem>
        <MenuItem value="joined" data-cy="sort-joined">
          joined
        </MenuItem>
      </TextField>

      {/* Order (select) */}
      <TextField
        select
        label="Order"
        size="small"
        value={order}
        onChange={(e) => setOrder(e.target.value as OrderKey)}
        SelectProps={{
          inputProps: { "data-cy": "order-select" },
          MenuProps: { PaperProps: { "data-cy": "order-menu" } as any },
        }}
      >
        <MenuItem value="desc" data-cy="order-desc">
          DESC
        </MenuItem>
        <MenuItem value="asc" data-cy="order-asc">
          ASC
        </MenuItem>
      </TextField>

      {/* Actions */}
      <div className="flex gap-2 items-center">
        <Button
          variant="contained"
          onClick={onApply}
          disabled={applyDisabled}
          data-cy="apply"
        >
          Apply
        </Button>
        <Button data-cy="load-more" variant="outlined" onClick={onLoadMore}>
          Load more
        </Button>
        <Button
          variant="outlined"
          onClick={onReset}
          disabled={disabled}
          data-cy="reset"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
