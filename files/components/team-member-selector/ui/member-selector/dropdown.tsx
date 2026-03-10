"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Member, getInitials } from "./types";

interface DropdownProps {
  members: Member[];
  selected: string[];
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Dropdown({
  members,
  selected,
  onSelect,
  searchQuery,
  onSearchChange,
}: DropdownProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredMembers = React.useMemo(() => {
    const query = searchQuery.toLowerCase();
    return members
      .filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.email?.toLowerCase().includes(query),
      )
      .sort((a, b) => {
        const aSelected = selected.includes(a.id);
        const bSelected = selected.includes(b.id);
        if (aSelected && !bSelected) return -1;
        if (!aSelected && bSelected) return 1;
        return 0;
      });
  }, [members, selected, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-full right-0 mt-2 w-72 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-50"
    >
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-muted/50 border border-transparent rounded-lg outline-none focus:border-primary/50 focus:bg-background text-muted-foreground placeholder:text-muted-foreground transition-colors"
          />
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30">
        <AnimatePresence mode="popLayout">
          {filteredMembers.map((member, index) => {
            const isSelected = selected.includes(member.id);
            return (
              <motion.button
                key={member.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.02, duration: 0.15 }}
                onClick={() => onSelect(member.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors",
                  isSelected
                    ? "bg-primary/5 hover:bg-primary/10"
                    : "hover:bg-muted/50",
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-full overflow-hidden flex-shrink-0 transition-all duration-200",
                    !isSelected && "grayscale opacity-60",
                  )}
                >
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={cn(
                        "w-full h-full flex items-center justify-center text-xs font-medium",
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {getInitials(member.name)}
                    </div>
                  )}
                </div>

                <div className="flex-1 text-left min-w-0">
                  <div
                    className={cn(
                      "text-sm font-medium truncate transition-colors",
                      isSelected ? "text-foreground" : "text-foreground/80",
                    )}
                  >
                    {member.name}
                  </div>
                  {member.email && (
                    <div className="text-xs text-muted-foreground truncate">
                      {member.email}
                    </div>
                  )}
                </div>

                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200",
                    isSelected
                      ? "bg-primary"
                      : "border-2 border-muted-foreground/30",
                  )}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    >
                      <Check
                        className="w-3 h-3 text-primary-foreground"
                        strokeWidth={3}
                      />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {filteredMembers.length === 0 && (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            No members found
          </div>
        )}
      </div>
    </motion.div>
  );
}
