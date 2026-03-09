"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TextMorph } from "torph/react";

import { Button } from "@/components/ui/button";
import ShieldIcon from "@/components/ui/icons/shield";
import PixelLoader from "@/components/ui/pixel-loader";

type TransactionState = "idle" | "processing" | "success";

function ButtonDemo() {
  const [state, setState] = React.useState<TransactionState>("idle");
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleBuyClick = () => {
    if (state !== "idle") return;

    setState("processing");
    timeoutRef.current = window.setTimeout(() => {
      setState("success");
    }, 3000);
  };

  const text =
    state === "processing"
      ? "Processing Transaction"
      : state === "success"
        ? "Transaction Safe"
        : "Make a Purchase";

  return (
    <div className="flex items-center justify-center h-screen">
      <Button
        variant="default"
        size="xl"
        onClick={handleBuyClick}
        className="w-fit justify-center gap-2"
      >
        <AnimatePresence mode="wait" initial={false}>
          {state === "processing" && (
            <motion.span
              key="loader"
              initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 45 }}
              transition={{ duration: 0.2 }}
              className="inline-flex"
            >
              <PixelLoader />
            </motion.span>
          )}
          {state === "success" && (
            <motion.span
              key="check"
              initial={{ opacity: 0, scale: 0.6, y: 2 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: -2 }}
              transition={{ duration: 0.2 }}
              className="inline-flex"
            >
              <ShieldIcon className="size-5 text-white" />
            </motion.span>
          )}
        </AnimatePresence>
        <TextMorph>{text}</TextMorph>
      </Button>
    </div>
  );
}

export default ButtonDemo;
