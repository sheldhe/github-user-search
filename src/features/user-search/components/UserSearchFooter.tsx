"use client";

import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";

type Props = {
  isFetching: boolean;
  hasMore: boolean;
  itemsLength: number;
  onLoadMore: () => void;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
};

export default function UserSearchFooter({
  isFetching,
  hasMore,
  itemsLength,
  onLoadMore,
  sentinelRef,
}: Props) {
  return (
    <>
      <div className="flex items-center justify-center">
        {isFetching ? (
          <div className="text-sm opacity-70">
            <CircularProgress />
          </div>
        ) : hasMore ? (
          <Button variant="outlined" onClick={onLoadMore}>
            Load more
          </Button>
        ) : itemsLength > 0 ? (
          <div className="text-sm opacity-70"></div>
        ) : (
          <div className="text-sm opacity-70">No results</div>
        )}
      </div>
      <div ref={sentinelRef} className="h-1" />
    </>
  );
}
