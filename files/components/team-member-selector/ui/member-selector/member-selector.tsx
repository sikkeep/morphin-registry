"use client";

import * as React from "react";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MemberSelectorProps } from "./types";
import { Avatar } from "./avatar";
import { AddButton } from "./add-button";
import { Dropdown } from "./dropdown";

const MemberSelector = React.forwardRef<HTMLDivElement, MemberSelectorProps>(
  (
    { members, selected, onChange, max, maxVisible = 5, label, className },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchQuery("");
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const sortedMembers = React.useMemo(() => {
      return [...members].sort((a, b) => {
        const aSelected = selected.includes(a.id);
        const bSelected = selected.includes(b.id);
        if (aSelected && !bSelected) return -1;
        if (!aSelected && bSelected) return 1;
        return 0;
      });
    }, [members, selected]);

    const visibleMembers = sortedMembers.slice(0, maxVisible);

    const toggleMember = (id: string) => {
      const isCurrentlySelected = selected.includes(id);

      if (isCurrentlySelected) {
        onChange(selected.filter((s) => s !== id));
      } else {
        if (max && selected.length >= max) return;
        onChange([...selected, id]);
      }
    };

    return (
      <div ref={ref} className={cn("relative", className)}>
        {label && (
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {label}
          </div>
        )}
        <div ref={containerRef} className="flex items-start gap-4 flex-wrap">
          <LayoutGroup>
            {visibleMembers.map((member) => (
              <Avatar
                key={member.id}
                member={member}
                isSelected={selected.includes(member.id)}
                onClick={() => toggleMember(member.id)}
              />
            ))}

            <div className="relative">
              <AddButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

              <AnimatePresence>
                {isOpen && (
                  <Dropdown
                    members={members}
                    selected={selected}
                    onSelect={toggleMember}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                )}
              </AnimatePresence>
            </div>
          </LayoutGroup>
        </div>
      </div>
    );
  },
);

MemberSelector.displayName = "MemberSelector";

export { MemberSelector };
