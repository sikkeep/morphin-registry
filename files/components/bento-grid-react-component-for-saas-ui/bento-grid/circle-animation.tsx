"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const CENTER_SIZE = 92;
const AVATAR_SIZE = 42;

const RINGS = [
  {
    size: 168,
    duration: 14,
    dir: 1,
    avatars: [
      {
        angle: 75,
        from: "from-sky-200",
        to: "to-blue-400",
        src: "https://api.dicebear.com/9.x/micah/svg?seed=Sara",
      },
      {
        angle: 255,
        from: "from-rose-200",
        to: "to-pink-400",
        src: "https://api.dicebear.com/9.x/micah/svg?seed=Brooklynn",
      },
    ],
  },
  {
    size: 258,
    duration: 22,
    dir: -1,
    avatars: [
      {
        angle: 140,
        from: "from-amber-200",
        to: "to-orange-400",
        src: "https://api.dicebear.com/9.x/micah/svg?seed=Leah",
      },
      {
        angle: 320,
        from: "from-violet-200",
        to: "to-purple-400",
        src: "https://api.dicebear.com/9.x/micah/svg?seed=Destiny",
      },
    ],
  },
  {
    size: 348,
    duration: 32,
    dir: 1,
    avatars: [
      {
        angle: 30,
        from: "from-lime-200",
        to: "to-green-400",
        src: "https://api.dicebear.com/9.x/micah/svg?seed=Eden",
      },
      {
        angle: 210,
        from: "from-fuchsia-200",
        to: "to-pink-500",
        src: "https://api.dicebear.com/9.x/micah/svg?seed=Sophia",
      },
    ],
  },
] as const;

function avatarPos(angleDeg: number, ringSize: number) {
  const r = ringSize / 2;
  const rad = (angleDeg * Math.PI) / 180;
  return {
    left: r + r * Math.cos(rad) - AVATAR_SIZE / 2,
    top: r - r * Math.sin(rad) - AVATAR_SIZE / 2,
  };
}

export default function CircleAnimation({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-full h-full flex items-center justify-center",
        className,
      )}
    >
      {RINGS.map((ring, i) => {
        const spinProps = {
          animate: { rotate: ring.dir * 360 },
          transition: {
            duration: ring.duration,
            repeat: Infinity,
            ease: "linear" as const,
          },
        };

        return (
          <div
            key={i}
            className="absolute"
            style={{
              width: ring.size,
              height: ring.size,
              marginTop: -ring.size / 2,
              marginLeft: -ring.size / 2,
              top: "50%",
              left: "50%",
            }}
          >
            <motion.div
              {...spinProps}
              className="relative w-full h-full rounded-full border-2 border-zinc-900/10"
            >
              {ring.avatars.map(
                (
                  av: { angle: number; from: string; to: string; src: string },
                  j: number,
                ) => {
                  const pos = avatarPos(av.angle, ring.size);
                  return (
                    <div
                      key={j}
                      className="absolute"
                      style={{
                        width: AVATAR_SIZE,
                        height: AVATAR_SIZE,
                        ...pos,
                      }}
                    >
                      <motion.div
                        animate={{ rotate: ring.dir * -360 }}
                        transition={{
                          duration: ring.duration,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className={cn(
                          "w-full h-full rounded-full overflow-hidden",
                          "bg-gradient-to-br shadow-md ring-2 ring-white/60",
                          av.from,
                          av.to,
                        )}
                      >
                        <img
                          src={av.src}
                          alt="Circle Avatar"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    </div>
                  );
                },
              )}
            </motion.div>
          </div>
        );
      })}

      <motion.div
        className="absolute z-10 rounded-full overflow-hidden bg-gradient-to-br from-lime-200 via-green-200 to-emerald-300 shadow-lg ring-4 ring-white/50"
        style={{ width: CENTER_SIZE, height: CENTER_SIZE }}
        animate={{ scale: [1, 1.07, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="https://api.dicebear.com/9.x/micah/svg?seed=Liam"
          alt="Circle Avatar Main"
          className="w-full h-full object-cover"
        />
      </motion.div>
    </div>
  );
}
