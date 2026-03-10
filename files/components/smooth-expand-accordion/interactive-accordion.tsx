"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionItem {
  id: string;
  number: string;
  title: string;
  content: string;
}

const items: AccordionItem[] = [
  {
    id: "design",
    number: "01",
    title: "Design",
    content:
      "We craft pixel-perfect interfaces that blend aesthetics with functionality, creating memorable digital experiences.",
  },
  {
    id: "development",
    number: "02",
    title: "Development",
    content:
      "Building robust, scalable solutions with modern technologies that stand the test of time and traffic.",
  },
  {
    id: "strategy",
    number: "03",
    title: "Strategy",
    content:
      "Data-driven insights and creative thinking combine to position your brand for lasting success.",
  },
  {
    id: "growth",
    number: "04",
    title: "Growth",
    content:
      "Sustainable scaling strategies that transform startups into industry leaders through measurable results.",
  },
];

export function UniqueAccordion() {
  const [activeId, setActiveId] = React.useState<string | null>("design");
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  return (
    <div className="w-full max-w-xl">
      <div className="space-y-0">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const isHovered = hoveredId === item.id;

          return (
            <div key={item.id}>
              <motion.button
                onClick={() => setActiveId(isActive ? null : item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative w-full"
                initial={false}
              >
                <div className="flex items-center gap-6 px-1 py-5">
                  <div className="relative flex h-10 w-10 items-center justify-center">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-foreground"
                      initial={false}
                      animate={{
                        scale: isActive ? 1 : isHovered ? 0.85 : 0,
                        opacity: isActive ? 1 : isHovered ? 0.1 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    />
                    <motion.span
                      className="relative z-10 text-sm font-medium tracking-wide"
                      animate={{
                        color: isActive
                          ? "var(--color-primary-foreground)"
                          : "var(--color-muted-foreground)",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.number}
                    </motion.span>
                  </div>

                  <motion.h3
                    className="text-2xl font-medium tracking-tight"
                    animate={{
                      x: isActive || isHovered ? 4 : 0,
                      color:
                        isActive || isHovered
                          ? "var(--color-foreground)"
                          : "var(--color-muted-foreground)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    {item.title}
                  </motion.h3>

                  <div className="ml-auto flex items-center gap-3">
                    <motion.div
                      className="flex h-8 w-8 items-center justify-center"
                      animate={{ rotate: isActive ? 45 : 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <motion.svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="text-foreground"
                        animate={{ opacity: isActive || isHovered ? 1 : 0.4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.path
                          d="M8 1V15M1 8H15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          initial={false}
                        />
                      </motion.svg>
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px origin-left bg-border"
                  initial={false}
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-px origin-left bg-foreground"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isActive ? 1 : isHovered ? 0.3 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </motion.button>

              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      transition: {
                        height: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2, delay: 0.1 },
                      },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.1 },
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <motion.p
                      className="py-6 pl-16 pr-12 leading-relaxed text-muted-foreground"
                      initial={{ y: -10 }}
                      animate={{ y: 0 }}
                      exit={{ y: -10 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      {item.content}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
