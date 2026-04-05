import { motion, AnimatePresence, type Transition } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { NavMenu, NavColumn } from "./nav-data";
import { cn } from "@/lib/utils";

type Direction = "ltr" | "rtl";

type MegaMenuProps = {
  menu: NavMenu | null;
  direction: Direction;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  panelRef?: React.RefObject<HTMLDivElement | null>;
  onEscape?: () => void;
};

const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];
const STAGGER_STEP = 0.038;
const ITEM_X = 18;
const CONTENT_X = 84;

function hasNavigableHref(href?: string): href is string {
  return Boolean(href && href !== "#");
}

const contentVariants = {
  enter: (direction: Direction) => ({
    opacity: 0,
    x: direction === "rtl" ? CONTENT_X : -CONTENT_X,
  }),
  center: { opacity: 1, x: 0 },
  exit: (direction: Direction) => ({
    opacity: 0,
    x: direction === "rtl" ? -CONTENT_X : CONTENT_X,
  }),
};

function flatIndex(
  colIdx: number,
  rowIdx: number,
  columns: NavColumn[],
): number {
  const before = columns
    .slice(0, colIdx)
    .reduce((sum, col) => sum + 1 + col.items.length, 0);
  return before + rowIdx + 1;
}

function itemDelay(
  colIdx: number,
  rowIdx: number,
  columns: NavColumn[],
  direction: Direction,
): number {
  const total = columns.reduce((sum, col) => sum + 1 + col.items.length, 0);
  let flat = flatIndex(colIdx, rowIdx, columns);
  if (direction === "rtl") flat = total - 1 - flat;
  return Math.max(0, flat) * STAGGER_STEP;
}

function itemInitial(direction: Direction) {
  return { opacity: 0, x: direction === "rtl" ? ITEM_X : -ITEM_X, y: 5 };
}

function itemTransition(
  colIdx: number,
  rowIdx: number,
  columns: NavColumn[],
  direction: Direction,
): Transition {
  return {
    duration: 0.18,
    ease: "easeOut",
    delay: itemDelay(colIdx, rowIdx, columns, direction),
  };
}

function MegaMenuPanel({
  menu,
  direction,
  onMouseEnter,
  onMouseLeave,
  panelRef,
  onEscape,
}: MegaMenuProps & { menu: NavMenu }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const initial = itemInitial(direction);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setHeight(entry.contentRect.height),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div
      id="desktop-mega-menu"
      ref={panelRef}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height }}
      exit={{ opacity: 0, height: 0 }}
      transition={{
        height: { duration: 0.28, ease: SPRING },
        opacity: { duration: 0.18, ease: "easeOut" },
      }}
      className="absolute -left-px -right-px top-[calc(100%-1px)] shadow-lg z-50 overflow-hidden rounded-b-xl border border-t-0 border-neutral-200 bg-white"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onEscape?.();
        }
      }}
    >
      <div ref={bodyRef}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={menu.id}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { duration: 0.26, ease: SPRING },
              opacity: { duration: 0.16, ease: "easeOut" },
            }}
            className="flex w-full"
          >
            {menu.columns.map((column, colIdx) => (
              <div
                key={column.heading}
                className={cn(
                  "flex-1 px-8 py-8",
                  column.accent ? "bg-neutral-50" : "bg-white",
                  colIdx !== 0 && "border-l border-neutral-200",
                )}
              >
                <motion.p
                  initial={initial}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={itemTransition(
                    colIdx,
                    -1,
                    menu.columns,
                    direction,
                  )}
                  className="mb-5 select-none text-xs font-semibold uppercase tracking-widest text-slate-500"
                >
                  {column.heading}
                </motion.p>

                <div className="flex flex-col gap-y-5">
                  {column.items.map((item, rowIdx) => (
                    hasNavigableHref(item.href) ? (
                      <motion.a
                        key={item.label}
                        href={item.href}
                        initial={initial}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={itemTransition(
                          colIdx,
                          rowIdx,
                          menu.columns,
                          direction,
                        )}
                        className="group block"
                        data-mega-menu-item="true"
                      >
                        <span className="block text-sm font-semibold leading-snug text-slate-900 transition-colors duration-150 group-hover:text-violet-600">
                          {item.label}
                        </span>
                        {item.description && (
                          <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                            {item.description}
                          </span>
                        )}
                      </motion.a>
                    ) : (
                      <motion.button
                        key={item.label}
                        type="button"
                        initial={initial}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={itemTransition(
                          colIdx,
                          rowIdx,
                          menu.columns,
                          direction,
                        )}
                        className="group block w-full text-left"
                        data-mega-menu-item="true"
                      >
                        <span className="block text-sm font-semibold leading-snug text-slate-900 transition-colors duration-150 group-hover:text-violet-600">
                          {item.label}
                        </span>
                        {item.description && (
                          <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                            {item.description}
                          </span>
                        )}
                      </motion.button>
                    )
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function MegaMenu({
  menu,
  direction,
  onMouseEnter,
  onMouseLeave,
  panelRef,
  onEscape,
}: MegaMenuProps) {
  return (
    <AnimatePresence>
      {menu && (
        <MegaMenuPanel
          key="mega-menu-panel"
          menu={menu}
          direction={direction}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          panelRef={panelRef}
          onEscape={onEscape}
        />
      )}
    </AnimatePresence>
  );
}
