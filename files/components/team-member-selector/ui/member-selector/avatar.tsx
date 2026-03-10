"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Member, getInitials } from "./types";

interface AvatarProps {
  member: Member;
  isSelected: boolean;
  onClick: () => void;
}

export function Avatar({ member, isSelected, onClick }: AvatarProps) {
  return (
    <motion.button
      layoutId={`member-${member.id}`}
      onClick={onClick}
      className="group relative flex flex-col items-center gap-1.5 outline-none cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div
        className={cn(
          "relative w-12 h-12 rounded-full overflow-hidden transition-all duration-200",
          "group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2",
          !isSelected && "opacity-50 hover:opacity-75",
        )}
      >
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            className={cn(
              "w-full h-full object-cover transition-all duration-200",
              !isSelected && "grayscale",
            )}
          />
        ) : (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center text-sm font-medium transition-colors duration-200",
              isSelected
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            {getInitials(member.name)}
          </div>
        )}
      </div>

      <AnimatePresence>
        {!isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute bottom-5 right-0 w-4 h-4 rounded-full bg-foreground dark:bg-white flex items-center justify-center shadow-sm"
          >
            <Plus
              className="w-2.5 h-2.5 text-background dark:text-black"
              strokeWidth={2.5}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.span
        layoutId={`member-name-${member.id}`}
        className={cn(
          "text-xs font-medium truncate max-w-[60px] transition-colors duration-200",
          isSelected ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {member.name.split(" ")[0]}
      </motion.span>
    </motion.button>
  );
}
