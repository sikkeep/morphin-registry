import { motion } from "framer-motion";
import { SpringArrow } from "./spring-arrow";

const HEADING_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function TeamSectionHeading() {
  return (
    <motion.div
      className="relative z-10 mx-auto flex w-full max-w-[1040px] justify-center pt-3 mb-10 md:mb-15"
      initial={{ opacity: 0, y: -22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.72, ease: HEADING_EASE }}
    >
      <div className="relative flex items-end justify-center gap-2 md:gap-3 lg:gap-4">
        <motion.div
          className="absolute -left-25 top-10 hidden size-16 shrink-0 text-white drop-shadow-[0_10px_12px_rgba(0,0,0,0.2)] md:block md:size-20 lg:size-24"
          initial={{ opacity: 0, x: -16, y: 12, rotate: 200 }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 165 }}
          transition={{ duration: 0.76, delay: 0.16, ease: HEADING_EASE }}
        >
          <SpringArrow />
        </motion.div>

        <h2 className="m-0 flex items-baseline justify-center gap-2 text-center text-[clamp(2.8rem,12vw,5.75rem)] font-extrabold leading-none tracking-tight md:text-[clamp(4rem,9vw,5.75rem)]">
          <span>Our</span>
          <span className="text-white/35">Team</span>
        </h2>
      </div>
    </motion.div>
  );
}
