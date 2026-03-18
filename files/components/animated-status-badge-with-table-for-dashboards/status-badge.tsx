import { AnimatePresence, motion, type Variants } from "framer-motion";
import { CheckCircle, Loader, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusState = "pending" | "failed" | "success";

export interface StatusBadgeProps {
  state?: StatusState;
  labels?: Partial<Record<StatusState, string>>;
  className?: string;
}

const DEFAULT_LABELS: Record<StatusState, string> = {
  pending: "Pending",
  failed: "Failed",
  success: "Success",
};

type GlowClasses = {
  icon: string;
  border: string;
  soft: string;
  mid: string;
  line: string;
};

const STATE_CLASSES: Record<StatusState, GlowClasses> = {
  pending: {
    icon: "text-amber-400",
    border: "border-amber-400/25",
    soft: "bg-[radial-gradient(ellipse_80%_100%_at_50%_100%,rgba(234,179,8,0.95)_0%,transparent_70%)]",
    mid: "bg-[radial-gradient(ellipse_70%_100%_at_50%_100%,rgba(234,179,8,0.85)_0%,transparent_70%)]",
    line: "bg-[radial-gradient(ellipse_40%_50%_at_50%_50%,rgba(234,179,8,0.95)_0%,transparent_100%)]",
  },
  failed: {
    icon: "text-red-500",
    border: "border-red-500/25",
    soft: "bg-[radial-gradient(ellipse_80%_100%_at_50%_100%,rgba(239,68,68,0.95)_0%,transparent_70%)]",
    mid: "bg-[radial-gradient(ellipse_70%_100%_at_50%_100%,rgba(239,68,68,0.85)_0%,transparent_70%)]",
    line: "bg-[radial-gradient(ellipse_40%_50%_at_50%_50%,rgba(239,68,68,0.95)_0%,transparent_100%)]",
  },
  success: {
    icon: "text-green-500",
    border: "border-green-500/25",
    soft: "bg-[radial-gradient(ellipse_80%_100%_at_50%_100%,rgba(34,197,94,0.95)_0%,transparent_70%)]",
    mid: "bg-[radial-gradient(ellipse_70%_100%_at_50%_100%,rgba(34,197,94,0.85)_0%,transparent_70%)]",
    line: "bg-[radial-gradient(ellipse_40%_50%_at_50%_50%,rgba(34,197,94,0.95)_0%,transparent_100%)]",
  },
};

const ICON_VARIANTS: Variants = {
  hidden: { scale: 0.35, opacity: 0, rotate: -25 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.32, ease: [0.175, 0.885, 0.32, 1.275] },
  },
  exit: {
    scale: 0.35,
    opacity: 0,
    rotate: 18,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

const LETTER_VARIANTS: Variants = {
  hidden: { y: -14, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.038,
      duration: 0.35,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

function TopGlow({ state }: { state: StatusState }) {
  const g = STATE_CLASSES[state];
  const t = { duration: 0.45 };
  return (
    <>
      <motion.span
        aria-hidden
        animate={{ opacity: 0.55 }}
        transition={t}
        className={cn(
          "pointer-events-none absolute -top-2 left-[10%] right-[10%] h-4 blur-[7px]",
          g.soft,
        )}
      />
      <motion.span
        aria-hidden
        animate={{ opacity: 0.75 }}
        transition={t}
        className={cn(
          "pointer-events-none absolute -top-1 left-[22%] right-[22%] h-2 blur-[3.5px]",
          g.mid,
        )}
      />
      <motion.span
        aria-hidden
        animate={{ opacity: 0.9 }}
        transition={t}
        className={cn(
          "pointer-events-none absolute top-0 left-[28%] right-[28%] h-px",
          g.line,
        )}
      />
    </>
  );
}

function StateIcon({ state }: { state: StatusState }) {
  const cls = STATE_CLASSES[state].icon;
  if (state === "pending") {
    return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        className={cn("flex", cls)}
      >
        <Loader size={16} strokeWidth={2.5} />
      </motion.div>
    );
  }
  if (state === "failed")
    return <XCircle size={16} strokeWidth={2} className={cls} />;
  return <CheckCircle size={16} strokeWidth={2} className={cls} />;
}

function AnimatedLabel({ text, id }: { text: string; id: string }) {
  return (
    <motion.span key={id} className="inline-flex overflow-hidden">
      {text.split("").map((char, i) => (
        <motion.span
          key={`${id}-${i}`}
          custom={i}
          variants={LETTER_VARIANTS}
          initial="hidden"
          animate="visible"
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

const MotionBadge = motion.create(Badge);

export function StatusBadge({
  state = "pending",
  labels,
  className,
}: StatusBadgeProps) {
  const label = { ...DEFAULT_LABELS, ...labels }[state];
  const cls = STATE_CLASSES[state];

  return (
    <MotionBadge
      variant="outline"
      className={cn(
        "relative h-auto cursor-default overflow-visible rounded-full",
        "gap-2 px-3 py-2",
        "bg-[rgba(28,28,32,0.88)] backdrop-blur-md",
        "text-white/90 text-[13px] font-medium tracking-[0.01em] leading-none",
        "transition-colors duration-300",
        cls.border,
        className,
      )}
    >
      <TopGlow state={state} />

      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={state}
            variants={ICON_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute flex items-center"
          >
            <StateIcon state={state} />
          </motion.span>
        </AnimatePresence>
      </span>

      <span className="flex leading-none">
        <AnimatePresence mode="wait">
          <AnimatedLabel key={state} text={label} id={state} />
        </AnimatePresence>
      </span>
    </MotionBadge>
  );
}
