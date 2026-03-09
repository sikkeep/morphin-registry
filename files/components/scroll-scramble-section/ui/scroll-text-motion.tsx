"use client";

import * as React from "react";
import {
  useScrollTextMotion,
  type ScrollTextGroup,
} from "@/hooks/use-scroll-text-motion";

interface ScrollTextMotionProps {
  groups: ScrollTextGroup[];
  logo?: string;
  className?: string;
}

export type {
  ScrollTextEl,
  ScrollTextGroup,
} from "@/hooks/use-scroll-text-motion";

export function ScrollTextMotion({
  groups,
  logo,
  className = "",
}: ScrollTextMotionProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const logoRef = React.useRef<HTMLSpanElement>(null);

  useScrollTextMotion(contentRef, logoRef, groups, logo);

  return (
    <div
      className={`scroll-text-motion min-h-screen bg-black text-white ${className}`}
    >
      {logo && (
        <div className="scroll-text-fixed fixed inset-0 grid place-items-center pointer-events-none z-0">
          <div className="scroll-text-logo text-[clamp(2rem,10vw,4rem)] font-[lores-12] font-normal">
            <span ref={logoRef}>{logo}</span>
          </div>
        </div>
      )}

      <div
        className="scroll-text-content pt-[100vh] pb-[25vh] px-6 relative z-10"
        ref={contentRef}
      >
        {groups.map((group, gi) => (
          <div key={gi} className="scroll-text-group flex flex-col mb-[10vh]">
            {group.items.map((item, ii) => (
              <div
                key={ii}
                className={`scroll-text-el el whitespace-nowrap uppercase ${
                  item.pos
                } ${item.xl ? "el--xl" : ""} ${
                  item.typingIndicator ? "typing-indicator" : ""
                }`}
                data-alt-pos={item.altPos}
                data-flip-ease={item.flipEase ?? "expo.inOut"}
                data-scramble-duration={String(item.scrambleDuration ?? 1)}
              >
                <span className="scroll-text-inner">{item.text}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
