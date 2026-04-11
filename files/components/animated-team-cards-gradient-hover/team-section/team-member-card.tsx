import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TeamCardTheme, TeamMember } from "./types";

const COLLAPSED_OVERLAP = 120;
const OPEN_GAP = 26;
const CARD_SPRING = {
  type: "spring",
  stiffness: 180,
  damping: 23,
  mass: 0.82,
} as const;

type TeamMemberCardProps = {
  member: TeamMember;
  index: number;
  totalMembers: number;
  activeIndex: number;
  disableMotion?: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
};

export const TEAM_CARD_BG_CLASS: Record<TeamCardTheme, string> = {
  violet: "bg-[image:var(--team-card-bg-violet)]",
  amber: "bg-[image:var(--team-card-bg-amber)]",
  cyan: "bg-[image:var(--team-card-bg-cyan)]",
};

function getStackOffset(index: number) {
  return index === 0 ? 0 : -COLLAPSED_OVERLAP;
}

function getLift(index: number, activeIndex: number) {
  if (activeIndex === -1) {
    return 0;
  }

  if (index === activeIndex) {
    return -24;
  }

  return Math.abs(index - activeIndex) === 1 ? -8 : 0;
}

export function TeamMemberCard({
  member,
  index,
  totalMembers,
  activeIndex,
  disableMotion = false,
  onActivate,
  onDeactivate,
}: TeamMemberCardProps) {
  const isExpanded = activeIndex !== -1;
  const shellClassName = cn(
    "relative flex shrink-0 flex-col justify-between overflow-hidden rounded-4xl border border-white/[0.06] bg-transparent p-7 shadow-[0_24px_48px_rgba(0,0,0,0.52),inset_0_1px_0_rgba(255,255,255,0.05)]",
    disableMotion
      ? "h-[360px] w-full max-w-none"
      : "h-[430px] w-full max-w-[320px]",
  );

  const content = (
    <>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-0 rounded-[inherit] bg-size-full bg-no-repeat",
          TEAM_CARD_BG_CLASS[member.theme],
        )}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] bg-[linear-gradient(180deg,rgba(8,8,10,0.96)_0%,rgba(8,8,10,0.88)_26%,rgba(8,8,10,0.32)_56%,rgba(8,8,10,0)_76%),linear-gradient(0deg,rgba(0,0,0,0.18),rgba(0,0,0,0.18))] bg-size-full bg-no-repeat"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit] border border-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-1px_0_rgba(0,0,0,0.22)]"
        aria-hidden
      />

      <header className="relative z-10 max-w-44">
        <h3 className="m-0 text-balance font-[family-name:var(--team-display-font)] text-2xl font-bold leading-tight tracking-tight text-white">
          {member.name}
        </h3>
        <p className="mt-2 text-base leading-tight tracking-tight text-white/80">
          {member.role}
        </p>
      </header>

      <div className="relative z-10 size-20 overflow-hidden rounded-3xl border border-[rgba(12,18,26,0.72)] bg-[rgba(15,16,19,0.72)] shadow-[0_12px_22px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <img
          src={member.avatar}
          alt=""
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          className="block h-full w-full object-cover saturate-[0.94] contrast-[1.02]"
        />
      </div>
    </>
  );

  if (disableMotion) {
    return <li className={shellClassName}>{content}</li>;
  }

  return (
    <motion.li
      className={shellClassName}
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: 1,
        y: getLift(index, activeIndex),
        marginLeft:
          index === 0 ? 0 : isExpanded ? OPEN_GAP : getStackOffset(index),
        zIndex: index === activeIndex ? totalMembers + 1 : index + 1,
      }}
      transition={{
        opacity: { duration: 0.28 },
        y: CARD_SPRING,
        marginLeft: CARD_SPRING,
        delay: index * 0.08,
      }}
      onHoverStart={onActivate}
      onHoverEnd={onDeactivate}
    >
      {content}
    </motion.li>
  );
}
