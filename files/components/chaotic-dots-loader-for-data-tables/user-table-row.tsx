import type { Transition } from "framer-motion";
import { motion } from "framer-motion";

import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { User, UserStatus } from "@/lib/types";

type UserTableRowProps = {
  user: User;
  reducedMotion: boolean;
  rowTransition: Transition;
};

function statusClassName(status: UserStatus) {
  if (status === "Active") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700";
  }

  if (status === "Invited") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-700";
  }

  return "border-zinc-500/30 bg-zinc-500/10 text-zinc-700";
}

export function UserTableRow({
  user,
  reducedMotion,
  rowTransition,
}: UserTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.team}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell>
        <motion.span
          layout={!reducedMotion}
          transition={rowTransition}
          className={cn(
            "inline-flex rounded-md border px-2 py-0.5 text-xs font-medium",
            statusClassName(user.status),
          )}
        >
          {user.status}
        </motion.span>
      </TableCell>
    </TableRow>
  );
}
