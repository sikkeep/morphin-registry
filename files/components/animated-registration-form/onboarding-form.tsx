"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Upload, Loader2, AtSign } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface OnboardingFormProps {
  className?: string;
  imageSrc: string;
  avatarSrc?: string;
  avatarFallback: string;
  title: string;
  description: string;
  inputPlaceholder: string;
  buttonText: string;
  onUploadClick?: () => void;
  onSubmit: (username: string) => void;
  isSubmitting?: boolean;
}

const FADE_UP_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const } },
};

const SCALE_DOWN_VARIANTS = {
  hidden: { scale: 1.2, opacity: 0 },
  show: { scale: 1, opacity: 1 },
};

const OnboardingForm = React.forwardRef<HTMLDivElement, OnboardingFormProps>(
  (
    {
      className,
      imageSrc,
      avatarSrc,
      avatarFallback,
      title,
      description,
      inputPlaceholder,
      buttonText,
      onUploadClick,
      onSubmit,
      isSubmitting = false,
    },
    ref,
  ) => {
    const [username, setUsername] = React.useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmit(username);
    };

    return (
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.15 } },
        }}
        className={cn(
          "w-full max-w-md overflow-hidden rounded-2xl border border-foreground/10 bg-background/60 shadow-lg backdrop-blur-lg",
          className,
        )}
        ref={ref}
      >
        <motion.div variants={SCALE_DOWN_VARIANTS}>
          <img
            src={imageSrc}
            alt="Welcome Banner"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <div className="space-y-6 p-8 text-center">
          <motion.div variants={FADE_UP_VARIANTS} className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </motion.div>

          <motion.div
            variants={FADE_UP_VARIANTS}
            className="flex items-center justify-between rounded-lg border border-foreground/10 bg-background/50 p-3"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={avatarSrc} alt="User Avatar" />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">
                  Your avatar
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG or JPG up to 10MB
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onUploadClick}>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={FADE_UP_VARIANTS}>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder={inputPlaceholder}
                  className="pl-9"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={FADE_UP_VARIANTS}>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {buttonText}
              </Button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    );
  },
);

OnboardingForm.displayName = "OnboardingForm";

export { OnboardingForm };
