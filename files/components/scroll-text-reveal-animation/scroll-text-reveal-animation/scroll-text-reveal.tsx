"use client";

import { useRef } from "react";
import {
  MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const HEADLINE = "we wanna be where the people are";
const CHARS = HEADLINE.split("");

const SCATTER_PRESETS = [
  { x: 980, y: -320, rotate: -16, scale: 0.92 },
  { x: 1120, y: 300, rotate: 12, scale: 1.03 },
  { x: 1260, y: -240, rotate: -9, scale: 0.95 },
  { x: 1080, y: 360, rotate: 15, scale: 1.05 },
  { x: 1380, y: -170, rotate: -11, scale: 0.94 },
  { x: 1200, y: 260, rotate: 8, scale: 1.01 },
] as const;

function getScatter(index: number) {
  const preset = SCATTER_PRESETS[index % SCATTER_PRESETS.length];
  const wave = Math.floor(index / SCATTER_PRESETS.length);

  return {
    x: preset.x + wave * 110,
    y: preset.y + (wave % 2 === 0 ? wave * 22 : -wave * 26),
    rotate: preset.rotate + wave * 1.4,
    scale: Math.max(0.88, preset.scale - wave * 0.01),
  };
}

function LetterSpan({
  char,
  index,
  reducedMotion,
  scrollYProgress,
}: {
  char: string;
  index: number;
  reducedMotion: boolean;
  scrollYProgress: MotionValue<number>;
}) {
  const start = Math.min(index * 0.013, 0.38);
  const end = Math.min(start + 0.18, 0.52);
  const fadeIn = Math.min(start + 0.04, end);
  const scatter = getScatter(index);

  const x = useTransform(scrollYProgress, [start, end], [scatter.x, 0]);
  const y = useTransform(scrollYProgress, [start, end], [scatter.y, 0]);
  const rotate = useTransform(
    scrollYProgress,
    [start, end],
    [scatter.rotate, 0],
  );
  const scale = useTransform(scrollYProgress, [start, end], [scatter.scale, 1]);
  const opacity = useTransform(
    scrollYProgress,
    [start, fadeIn, end],
    [0, 1, 1],
  );

  if (reducedMotion) {
    return <span className="inline-block">{char}</span>;
  }

  return (
    <motion.span
      className="inline-block will-change-transform"
      style={{ x, y, rotate, scale, opacity }}
    >
      {char}
    </motion.span>
  );
}

export function ScrollTextReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const headlineX = useTransform(
    scrollYProgress,
    [0, 0.52, 0.64, 1],
    ["200vw", "0vw", "0vw", "-160vw"],
  );
  const subtitleOpacity = useTransform(scrollYProgress, [0.46, 0.6], [0, 1]);
  const subtitleY = useTransform(scrollYProgress, [0.46, 0.6], [28, 0]);

  return (
    <div ref={containerRef} className={reducedMotion ? "h-screen" : "h-[460vh]"}>
      <section className="sticky top-0 h-screen overflow-hidden bg-[#EEEAE3]">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center text-center text-[clamp(72px,16vw,260px)] leading-[0.86] font-black text-[rgba(10,10,10,0.08)] uppercase select-none"
        >
          Scroll Down
        </div>

        <div className="relative z-10 flex h-full flex-col justify-center px-[clamp(20px,4vw,72px)]">
          <div className="w-full overflow-visible">
            <motion.div
              aria-label={HEADLINE}
              className="flex w-full justify-end whitespace-nowrap select-none"
              style={{ x: reducedMotion ? 0 : headlineX }}
            >
              <div
                aria-hidden="true"
                className="inline-flex items-baseline pr-[clamp(6px,1vw,24px)] text-[clamp(54px,10.5vw,168px)] leading-[0.88] font-black tracking-[-0.04em] text-[#0A0A0A]"
              >
                {CHARS.map((char, index) =>
                  char === " " ? (
                    <span key={index} className="inline-block w-[0.28em]" />
                  ) : (
                    <LetterSpan
                      key={index}
                      char={char}
                      index={index}
                      reducedMotion={reducedMotion}
                      scrollYProgress={scrollYProgress}
                    />
                  ),
                )}
              </div>
            </motion.div>
          </div>

          <motion.p
            className="mx-auto mt-30 max-w-[34rem] px-6 text-center text-[clamp(24px,1.2vw,28px)] leading-[1.4] text-[#0A0A0A]"
            style={{
              opacity: reducedMotion ? 1 : subtitleOpacity,
              y: reducedMotion ? 0 : subtitleY,
            }}
          >
            Audiences are more scattered <em>and</em> more reachable than ever.
            We help brands become leaders on the channels of the new mainstream.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
