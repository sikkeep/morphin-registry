import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { StatusBadge, StatusState } from "@/components/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Row {
  id: string;
  label: string;
  status: StatusState;
  resolvedAt?: number;
}

const RESOLVED: ReadonlySet<StatusState> = new Set(["success", "failed"]);

const STATUS_CYCLE: StatusState[] = ["pending", "success", "failed"];

function cycleStatus(current: StatusState): StatusState {
  return STATUS_CYCLE[
    (STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length
  ];
}

function sortRows(rows: Row[]): Row[] {
  return [...rows].sort((a, b) => {
    const aResolved = RESOLVED.has(a.status);
    const bResolved = RESOLVED.has(b.status);
    if (aResolved && !bResolved) return -1;
    if (!aResolved && bResolved) return 1;
    if (aResolved && bResolved)
      return (b.resolvedAt ?? 0) - (a.resolvedAt ?? 0);
    return 0;
  });
}

const INITIAL_ROWS: Row[] = [
  { id: "a", label: "Deploy to production", status: "pending" },
  { id: "b", label: "Run test suite", status: "pending" },
  { id: "c", label: "Build docker image", status: "pending" },
  { id: "d", label: "Notify stakeholders", status: "pending" },
];

const ROW_VARIANTS = {
  initial: { opacity: 0, y: -6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const },
  },
  exit: {
    opacity: 0,
    y: 6,
    transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const LAYOUT_TRANSITION = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
};

const MotionTableRow = motion.create(TableRow);

export default function Demo() {
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);

  useEffect(() => {
    let cursor = 0;
    const id = setInterval(() => {
      setRows((prev) => {
        const index = cursor % prev.length;
        cursor += 1;
        return prev.map((row, i) => {
          if (i !== index) return row;
          const next = cycleStatus(row.status);
          return {
            ...row,
            status: next,
            resolvedAt: RESOLVED.has(next) ? Date.now() : undefined,
          };
        });
      });
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const sorted = sortRows(rows);

  return (
    <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center">
      <div className="w-[560px] rounded-2xl border border-white/[0.07] bg-[rgba(18,18,22,0.95)] backdrop-blur-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.07] hover:bg-transparent">
              <TableHead className="text-white/35 pl-6 w-[240px]">
                Task
              </TableHead>
              <TableHead className="text-white/35 w-[150px]">Status</TableHead>
              <TableHead className="w-5" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence initial={false}>
              {sorted.map((row) => (
                <MotionTableRow
                  key={row.id}
                  layoutId={row.id}
                  layout="position"
                  transition={LAYOUT_TRANSITION}
                  variants={ROW_VARIANTS}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="border-white/[0.06] hover:bg-transparent"
                >
                  <TableCell className="pl-6 py-4 text-white/55 text-sm">
                    {row.label}
                  </TableCell>
                  <TableCell className="py-4">
                    <StatusBadge state={row.status} />
                  </TableCell>
                  <TableCell className="py-4 pr-4 text-white/25">
                    <MoreHorizontal size={16} />
                  </TableCell>
                </MotionTableRow>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
