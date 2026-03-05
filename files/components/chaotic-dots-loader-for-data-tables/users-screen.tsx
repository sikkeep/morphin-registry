import {
  AnimatePresence,
  motion,
  useReducedMotion,
  Transition,
} from "framer-motion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { ChaoticPixelsLoader } from "./chaotic-pixels-loader";
import { UserRowsSkeleton } from "./user-rows-skeleton";
import { UserTableRow } from "./user-table-row";
import { useUsersInfiniteLoading } from "@/hooks/use-users-infinite-loading";

type UserTableTransitions = {
  layout: Transition;
  row: Transition;
  loader: Transition;
  tableSlow: Transition;
};

export function getUserTableTransitions(
  reducedMotion: boolean,
): UserTableTransitions {
  if (reducedMotion) {
    return {
      layout: { duration: 0 },
      row: { duration: 0 },
      loader: { duration: 0.2 },
      tableSlow: { duration: 0.2 },
    };
  }

  return {
    layout: { type: "spring", stiffness: 260, damping: 28, mass: 0.72 },
    row: { type: "spring", stiffness: 320, damping: 27, mass: 0.58 },
    loader: { type: "spring", stiffness: 280, damping: 26, mass: 0.64 },
    tableSlow: { type: "spring", stiffness: 170, damping: 28, mass: 0.9 },
  };
}

export function UsersScreen() {
  const reducedMotion = useReducedMotion() ?? false;
  const transitions = getUserTableTransitions(reducedMotion);
  const {
    users,
    isFetchingMore,
    showLoader,
    totalLoaded,
    scrollContainerRef,
    sentinelRef,
  } = useUsersInfiniteLoading();

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-50 p-6 md:p-10">
      <motion.section
        layout
        transition={transitions.layout}
        className="mx-auto flex w-full max-w-6xl flex-col gap-4"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
            <p className="text-sm text-muted-foreground">
              shadcn table with chaotic pixel loader and infinite data loading.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {totalLoaded} loaded
          </div>
        </div>

        <div className="relative">
          <div className="relative h-[18px]">
            <AnimatePresence>
              {showLoader ? (
                <motion.div
                  key="pixel-loader"
                  initial={reducedMotion ? false : { y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reducedMotion ? { opacity: 0 } : { y: 10, opacity: 0 }}
                  transition={transitions.loader}
                  className="absolute inset-0 origin-bottom pointer-events-none"
                >
                  <ChaoticPixelsLoader reducedMotion={reducedMotion} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <motion.div
            layout
            animate={
              reducedMotion
                ? undefined
                : {
                    y: showLoader ? 5 : 0,
                    opacity: showLoader ? 0.6 : 1,
                  }
            }
            transition={showLoader ? transitions.tableSlow : transitions.layout}
            style={{ transformOrigin: "top center" }}
            ref={scrollContainerRef}
            className={cn(
              "max-h-[68vh] overflow-auto rounded-xl border bg-card shadow-sm",
            )}
          >
            <Table className="min-w-[840px]">
              <TableHeader className="sticky top-0 z-10 bg-card/95 backdrop-blur">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.length === 0 ? (
                  <UserRowsSkeleton reducedMotion={reducedMotion} />
                ) : (
                  <AnimatePresence initial={false}>
                    {users.map((user) => (
                      <UserTableRow
                        key={user.id}
                        user={user}
                        reducedMotion={reducedMotion}
                        rowTransition={transitions.row}
                      />
                    ))}
                  </AnimatePresence>
                )}

                <AnimatePresence initial={false}>
                  {isFetchingMore ? (
                    <motion.tr
                      key="fetching-row"
                      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={
                        reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }
                      }
                      transition={transitions.row}
                      className="border-b"
                    >
                      <TableCell
                        colSpan={5}
                        className="py-6 text-center text-muted-foreground"
                      >
                        Loading next users...
                      </TableCell>
                    </motion.tr>
                  ) : null}
                </AnimatePresence>
              </TableBody>
            </Table>

            <div ref={sentinelRef} className="h-px w-full" />
          </motion.div>
        </div>

        <p className="text-xs text-muted-foreground">
          Scroll to the end of the table to keep loading more rows.
        </p>
      </motion.section>
    </main>
  );
}
