"use client";

import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isSpeaking?: boolean;
}

const participants: Participant[] = [
  {
    id: "1",
    name: "Oğuz",
    avatar: "https://i.pravatar.cc/150?img=11",
    isSpeaking: true,
  },
  { id: "2", name: "Ashish", avatar: "https://i.pravatar.cc/150?img=12" },
  { id: "3", name: "Mariana", avatar: "https://i.pravatar.cc/150?img=32" },
  { id: "4", name: "MDS", avatar: "https://i.pravatar.cc/150?img=14" },
  { id: "5", name: "Ana", avatar: "https://i.pravatar.cc/150?img=5" },
  {
    id: "6",
    name: "Natko",
    avatar: "https://i.pravatar.cc/150?img=33",
    isSpeaking: true,
  },
  { id: "7", name: "Afshin", avatar: "https://i.pravatar.cc/150?img=51" },
];

const COLLAPSED_WIDTH = 268;
const EXPANDED_WIDTH = 360;
const EXPANDED_HEIGHT = 420;

const AVATAR_SIZE_COLLAPSED = 44;
const AVATAR_SIZE_EXPANDED = 56;
const AVATAR_OVERLAP = -12;

function SpeakingIndicator({ show }: { show: boolean }) {
  return (
    <div
      className={cn(
        "absolute -top-1 -right-1 rounded-full bg-background p-1.5 shadow-md",
        "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        show ? "scale-100 opacity-100" : "scale-0 opacity-0",
      )}
    >
      <div className="flex items-center justify-center gap-[2px]">
        <span className="w-[3px] rounded-full bg-foreground animate-wave-1" />
        <span className="w-[3px] rounded-full bg-foreground animate-wave-2" />
        <span className="w-[3px] rounded-full bg-foreground animate-wave-3" />
      </div>
    </div>
  );
}

function AudioWaveIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <div
      className={cn(
        "absolute flex h-10 w-10 items-center justify-center rounded-full bg-foreground",
        "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        isExpanded ? "scale-75 opacity-0" : "scale-100 opacity-100",
      )}
      style={{
        left: 12,
        top: "50%",
        transform: `translateY(-50%) ${
          isExpanded ? "scale(0.75)" : "scale(1)"
        }`,
      }}
    >
      <div className="flex items-center justify-center gap-[2px]">
        <span className="w-[3px] rounded-full bg-background animate-wave-1" />
        <span className="w-[3px] rounded-full bg-background animate-wave-2" />
        <span className="w-[3px] rounded-full bg-background animate-wave-3" />
      </div>
    </div>
  );
}

function getAvatarPosition(index: number, isExpanded: boolean) {
  if (!isExpanded) {
    const startX = 60;
    return {
      x: startX + index * (AVATAR_SIZE_COLLAPSED + AVATAR_OVERLAP),
      y: 8,
      size: AVATAR_SIZE_COLLAPSED,
      opacity: index < 4 ? 1 : 0,
      scale: 1,
    };
  }

  const gridStartX = 28;
  const gridStartY = 70;
  const colWidth = 80;
  const rowHeight = 95;

  const col = index < 4 ? index : index - 4;
  const row = index < 4 ? 0 : 1;

  return {
    x: gridStartX + col * colWidth,
    y: gridStartY + row * rowHeight,
    size: AVATAR_SIZE_EXPANDED,
    opacity: 1,
    scale: 1,
  };
}

export function VoiceChat() {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div
      onClick={() => !isExpanded && setIsExpanded(true)}
      className={cn(
        "relative overflow-hidden border border-border bg-background shadow-xl shadow-black/10",
        "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        !isExpanded && "cursor-pointer hover:shadow-2xl hover:shadow-black/15",
      )}
      style={{
        width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
        height: isExpanded ? EXPANDED_HEIGHT : 60,
        borderRadius: isExpanded ? 24 : 999,
      }}
    >
      <AudioWaveIcon isExpanded={isExpanded} />

      {/* +N counter (collapsed) */}
      <div
        className={cn(
          "absolute flex items-center gap-0.5 text-muted-foreground",
          "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isExpanded ? "pointer-events-none opacity-0" : "opacity-100",
        )}
        style={{ right: 16, top: "50%", transform: "translateY(-50%)" }}
      >
        <span className="text-md font-medium">+3</span>
        <ChevronDown className="h-4 w-4" />
      </div>

      {/* Header (expanded) */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 flex items-center justify-between px-5 pb-3 pt-4",
          "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isExpanded ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        style={{ transitionDelay: isExpanded ? "100ms" : "0ms" }}
      >
        <div className="w-8" />
        <h2 className="text-[15px] font-semibold text-foreground">
          Voice Chat
        </h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(false);
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-muted"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Divider */}
      <div
        className={cn(
          "absolute left-4 right-4 h-px bg-border",
          "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isExpanded ? "opacity-100" : "opacity-0",
        )}
        style={{ top: 52 }}
      />

      {/* Participants */}
      {participants.map((participant, index) => {
        const pos = getAvatarPosition(index, isExpanded);
        const delay = isExpanded ? index * 30 : (6 - index) * 20;

        return (
          <div
            key={participant.id}
            className="absolute transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{
              left: pos.x,
              top: pos.y,
              width: pos.size,
              height: isExpanded ? pos.size + 28 : pos.size,
              opacity: pos.opacity,
              zIndex: isExpanded ? 1 : 4 - index,
              transitionDelay: `${delay}ms`,
            }}
          >
            <div className="relative flex flex-col items-center">
              <div
                className="overflow-hidden rounded-full ring-[2.5px] ring-background shadow-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{ width: pos.size, height: pos.size }}
              >
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <SpeakingIndicator
                show={isExpanded && !!participant.isSpeaking}
              />

              <span
                className={cn(
                  "absolute whitespace-nowrap text-[13px] font-medium text-muted-foreground",
                  "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  isExpanded ? "opacity-100" : "opacity-0",
                )}
                style={{
                  top: pos.size + 8,
                  transitionDelay: isExpanded ? `${150 + index * 30}ms` : "0ms",
                }}
              >
                {participant.name}
              </span>
            </div>
          </div>
        );
      })}

      {/* Join button */}
      <button
        className={cn(
          "absolute left-4 right-4 rounded-2xl bg-foreground py-3.5 text-[15px] font-medium text-background",
          "shadow-lg shadow-foreground/20 hover:opacity-90 active:scale-[0.98]",
          "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isExpanded
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
        style={{ bottom: 50, transitionDelay: isExpanded ? "200ms" : "0ms" }}
      >
        Join Now
      </button>

      {/* Helper text */}
      <p
        className={cn(
          "absolute inset-x-0 text-center text-[13px] text-muted-foreground",
          "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isExpanded ? "opacity-100" : "opacity-0",
        )}
        style={{ bottom: 16, transitionDelay: isExpanded ? "250ms" : "0ms" }}
      >
        Mic will be muted initially.
      </p>
    </div>
  );
}
