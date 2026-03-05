import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type UserRowsSkeletonProps = {
  reducedMotion: boolean;
};

const SKELETON_ROWS = 10;

export function UserRowsSkeleton({ reducedMotion }: UserRowsSkeletonProps) {
  return Array.from({ length: SKELETON_ROWS }, (_, rowIndex) => (
    <TableRow key={`skeleton-row-${rowIndex}`} className="hover:bg-transparent">
      <TableCell>
        <div
          className={cn(
            "h-3.5 w-32 rounded bg-blue-100/70",
            !reducedMotion && "animate-pulse",
          )}
        />
      </TableCell>
      <TableCell>
        <div
          className={cn(
            "h-3.5 w-44 rounded bg-blue-100/70",
            !reducedMotion && "animate-pulse",
          )}
        />
      </TableCell>
      <TableCell>
        <div
          className={cn(
            "h-3.5 w-20 rounded bg-blue-100/70",
            !reducedMotion && "animate-pulse",
          )}
        />
      </TableCell>
      <TableCell>
        <div
          className={cn(
            "h-3.5 w-16 rounded bg-blue-100/70",
            !reducedMotion && "animate-pulse",
          )}
        />
      </TableCell>
      <TableCell>
        <div
          className={cn(
            "h-5 w-20 rounded-md bg-blue-100/80",
            !reducedMotion && "animate-pulse",
          )}
        />
      </TableCell>
    </TableRow>
  ));
}
