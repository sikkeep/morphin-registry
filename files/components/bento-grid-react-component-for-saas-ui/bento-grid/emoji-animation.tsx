import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

const EMOJIS = [
  { src: "https://emoji.beeimg.com/😂/apple", char: "😂" },
  { src: "https://emoji.beeimg.com/🏆/apple", char: "🏆" },
  { src: "https://emoji.beeimg.com/🔥/apple", char: "🔥" },
  { src: "https://emoji.beeimg.com/🍔/apple", char: "🍔" },
  { src: "https://emoji.beeimg.com/🎀/apple", char: "🎀" },
];

const EMOJI_X = EMOJIS.map((_, i) => 20 + i * 44 + 12);

const SPRING = { type: "spring", stiffness: 400, damping: 18 } as const;
const ENTER_SPRING = { type: "spring", stiffness: 280, damping: 26 } as const;

export default function EmojiAnimation({ className }: { className?: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [floatKey, setFloatKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % EMOJIS.length);
      setFloatKey((k) => k + 1);
    }, 1700);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={cn("w-full h-full overflow-hidden", className)}>
      <Message />
      <EmojiPicker activeIdx={activeIdx} />

      <AnimatePresence>
        <motion.span
          key={floatKey}
          className="absolute text-xl pointer-events-none select-none"
          style={{ left: EMOJI_X[activeIdx] - 12, bottom: 68 }}
          initial={{ y: 0, opacity: 1, scale: 0.8 }}
          animate={{ y: -52, opacity: 0, scale: 1.6 }}
          exit={{}}
          transition={{ duration: 1, ease: [0.2, 0, 0.8, 1] }}
        >
          {EMOJIS[activeIdx].char}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function Message() {
  return (
    <motion.div
      className="hidden sm:block absolute bottom-5 top-5 my-auto right-0 bg-white border border-zinc-100 shadow-lg max-w-[250px] rounded-l-2xl px-5 py-4"
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ...ENTER_SPRING, delay: 0.2 }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full overflow-hidden bg-emerald-200">
            <img
              src="https://api.dicebear.com/9.x/micah/svg?seed=Ralph"
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm font-semibold text-zinc-900">
            Ralph Lonely
          </span>
        </div>
        <p className="text-xs text-zinc-500">
          Hey there! I hope this message finds you well. I just wanted to check
          in and see how you're doing. 😊
        </p>
      </div>
    </motion.div>
  );
}

function EmojiPicker({ activeIdx }: { activeIdx: number }) {
  return (
    <motion.div
      className="absolute left-0 bottom-5 max-w-[250px] w-full bg-white rounded-r-2xl px-5 py-4 border border-zinc-100 shadow-lg"
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ...ENTER_SPRING, delay: 0.4 }}
    >
      <div className="flex items-center gap-5">
        {EMOJIS.map(({ src, char }, idx) => (
          <motion.div
            key={char}
            className="relative"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...ENTER_SPRING, delay: 0.5 + idx * 0.07 }}
          >
            <AnimatePresence>
              {activeIdx === idx && (
                <motion.div
                  key="glow"
                  className="absolute inset-0 rounded-full bg-amber-300/40 blur-sm"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 2.2, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              )}
            </AnimatePresence>

            <motion.img
              src={src}
              alt={char}
              className="relative size-6 object-cover"
              animate={
                activeIdx === idx
                  ? { scale: [1, 1.55, 1.3], y: [0, -6, 0] }
                  : { scale: 1, y: 0 }
              }
              transition={SPRING}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
