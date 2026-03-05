import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { User, UserStatus } from "@/lib/types";

export const USER_STATUSES: UserStatus[] = ["Active", "Invited", "Blocked"];

export const PAGE_SIZE = 20;
export const INITIAL_LOADING_MS = 3600;

const firstNames = [
  "Olivia",
  "Liam",
  "Noah",
  "Emma",
  "Mason",
  "Sophia",
  "Ava",
  "James",
  "Mia",
  "Elijah",
  "Amelia",
  "Lucas",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Brown",
  "Miller",
  "Davis",
  "Wilson",
  "Taylor",
  "Anderson",
  "Thomas",
  "Jackson",
  "White",
  "Moore",
];

const teams = [
  "Product",
  "Platform",
  "Design",
  "Growth",
  "Support",
  "Analytics",
];

const roles = ["Admin", "Manager", "Editor", "Viewer"];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildUser(id: number): User {
  const first = firstNames[id % firstNames.length];
  const last = lastNames[(id * 7) % lastNames.length];
  const slug = `${first}.${last}${id}`.toLowerCase();

  return {
    id,
    name: `${first} ${last}`,
    email: `${slug}@example.com`,
    team: teams[(id * 3) % teams.length],
    role: roles[(id * 5) % roles.length],
    status: USER_STATUSES[(id * 11) % USER_STATUSES.length],
  };
}

export async function fetchUsersPage(
  page: number,
  pageSize: number,
): Promise<User[]> {
  const requestTime = 700 + Math.floor(Math.random() * 500);
  await sleep(requestTime);

  const start = page * pageSize + 1;
  return Array.from({ length: pageSize }, (_, index) =>
    buildUser(start + index),
  );
}

type UseUsersInfiniteLoadingResult = {
  users: User[];
  isInitialLoading: boolean;
  isFetchingMore: boolean;
  showLoader: boolean;
  totalLoaded: number;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  sentinelRef: RefObject<HTMLDivElement | null>;
};

export function useUsersInfiniteLoading(): UseUsersInfiniteLoadingResult {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const pageRef = useRef(0);
  const requestLockRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadNextPage = useCallback(async () => {
    if (isInitialLoading || requestLockRef.current) {
      return;
    }

    requestLockRef.current = true;
    setIsFetchingMore(true);

    try {
      const nextRows = await fetchUsersPage(pageRef.current, PAGE_SIZE);
      setUsers((prev) => [...prev, ...nextRows]);
      setPage((prev) => {
        const next = prev + 1;
        pageRef.current = next;
        return next;
      });
    } finally {
      setIsFetchingMore(false);
      requestLockRef.current = false;
    }
  }, [isInitialLoading]);

  useEffect(() => {
    let cancelled = false;

    const loadInitialPage = async () => {
      try {
        const [firstPage] = await Promise.all([
          fetchUsersPage(0, PAGE_SIZE),
          sleep(INITIAL_LOADING_MS),
        ]);

        if (cancelled) {
          return;
        }

        setUsers(firstPage);
        setPage(1);
        pageRef.current = 1;
      } finally {
        if (!cancelled) {
          setIsInitialLoading(false);
        }
      }
    };

    void loadInitialPage();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const root = scrollContainerRef.current;
    const sentinel = sentinelRef.current;

    if (!root || !sentinel || isInitialLoading) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadNextPage();
        }
      },
      {
        root,
        rootMargin: "240px 0px",
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [isInitialLoading, loadNextPage, page]);

  return {
    users,
    isInitialLoading,
    isFetchingMore,
    showLoader: isInitialLoading || isFetchingMore,
    totalLoaded: users.length,
    scrollContainerRef,
    sentinelRef,
  };
}
