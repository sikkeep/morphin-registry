"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function AddButton({ onClick, isOpen }: AddButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="group flex flex-col items-center gap-1.5 outline-none cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-200",
          "group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2",
          isOpen
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/40 hover:border-muted-foreground/60 hover:bg-muted/50",
        )}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus
            className={cn(
              "w-5 h-5 transition-colors duration-200",
              isOpen ? "text-primary" : "text-muted-foreground",
            )}
          />
        </motion.div>
      </div>
      <span
        className={cn(
          "text-xs font-medium transition-colors duration-200",
          isOpen ? "text-primary" : "text-muted-foreground",
        )}
      >
        Add
      </span>
    </motion.button>
  );
}
