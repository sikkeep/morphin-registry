"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TextMorph } from "torph/react";

import * as Button from "@/components/ui/button";

import TrashIcon from "@/components/ui/icons/trash";
import SuccessIcon from "@/components/ui/icons/success";

export default function Demo() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSuccess = () => {
    if (loading || success) return;

    setLoading(true);

    loadingTimeout.current = setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  useEffect(() => {
    if (!success) return;

    const id = setTimeout(() => {
      setSuccess(false);
    }, 2000);

    return () => clearTimeout(id);
  }, [success]);

  useEffect(() => {
    return () => {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
    };
  }, []);

  return (
    <section className="flex min-h-screen items-center justify-center gap-4 px-6">
      <Button.Root
        variant={success ? "success" : "error"}
        mode="animatedBorder"
        size="medium"
        onClick={handleSuccess}
        animateBorder={loading}
        showAnimatedBorder={loading}
        animatedBorderStyle={loading ? "dashed" : "solid"}
        disabled={loading}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={success ? "success" : "remove"}
            initial={false}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.4, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Button.Icon
              as={success ? SuccessIcon : TrashIcon}
              className="size-5"
              aria-hidden
            />
          </motion.div>
        </AnimatePresence>
        <TextMorph>{success ? "Success" : "Remove"}</TextMorph>
      </Button.Root>
    </section>
  );
}
