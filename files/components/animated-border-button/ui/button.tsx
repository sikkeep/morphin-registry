import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

const buttonRootVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "text-white",
        neutral: "text-zinc-900",
        error: "text-red-700",
        success: "text-green-600",
      },
      mode: {
        filled: "",
        stroke: "border border-border text-neutral-500 shadow-sm",
        lighter: "border border-border text-neutral-500 shadow-sm",
        ghost: "bg-transparent",
        animatedBorder: "relative border-0 bg-transparent",
      },
      size: {
        medium: "h-10 px-3.5 text-sm",
        small: "h-9 px-3 text-sm",
        xsmall: "h-8 px-2.5 text-sm",
        xxsmall: "h-7 px-2 text-xs",
        "xxsmall-icon": "size-7 text-xs",
      },
    },
    compoundVariants: [
      {
        variant: "neutral",
        mode: "stroke",
        class: "border-zinc-200 bg-white hover:bg-zinc-50",
      },
      {
        variant: "neutral",
        mode: "filled",
        class: "bg-zinc-900 text-white hover:bg-zinc-800",
      },
      {
        variant: "primary",
        mode: "filled",
        class: "bg-indigo-600 hover:bg-indigo-700",
      },
      {
        variant: "error",
        mode: "filled",
        class: "bg-red-600 text-white hover:bg-red-700",
      },
      {
        variant: "neutral",
        mode: "lighter",
        class: "bg-zinc-100 hover:bg-zinc-200",
      },
      { variant: "neutral", mode: "ghost", class: "hover:bg-zinc-100" },
      {
        variant: "primary",
        mode: "animatedBorder",
        class: "bg-zinc-900 text-white hover:bg-zinc-800",
      },
      {
        variant: "neutral",
        mode: "animatedBorder",
        class: "bg-zinc-900 border border-border text-white hover:bg-zinc-800",
      },
      {
        variant: "error",
        mode: "animatedBorder",
        class: "bg-red-50 border border-red-600 text-red-600 hover:bg-red-100",
      },
      {
        variant: "success",
        mode: "animatedBorder",
        class:
          "bg-green-50 border border-green-600 text-green-600 hover:bg-green-100 hover:text-green-700",
      },
    ],
    defaultVariants: {
      variant: "primary",
      mode: "filled",
      size: "medium",
    },
  },
);

const buttonIconVariants = cva(
  "inline-flex shrink-0 items-center justify-center",
  {
    variants: {
      size: {
        medium: "size-5",
        small: "size-4",
        xsmall: "size-4",
        xxsmall: "size-3.5",
        "xxsmall-icon": "size-4",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  },
);

type SharedProps = VariantProps<typeof buttonRootVariants>;

type AnimatedBorderProps = {
  showAnimatedBorder?: boolean;
  animateBorder?: boolean;
  animatedBorderStrokeWidth?: number;
  animatedBorderStyle?: "dashed" | "solid";
};

type ButtonRootProps = ButtonHTMLAttributes<HTMLButtonElement> &
  SharedProps & {
    asChild?: boolean;
  } & AnimatedBorderProps;

const BUTTON_RADIUS = 7;

const DashedBorderSvg = ({
  animate = true,
  strokeWidth = 2,
  borderStyle = "dashed",
}: {
  animate?: boolean;
  strokeWidth?: number;
  borderStyle?: "dashed" | "solid";
}) => {
  const normalizedStrokeWidth = Math.max(strokeWidth, 0.5);
  const inset = normalizedStrokeWidth / 2;
  const rectRadius = Math.max(BUTTON_RADIUS - inset, 0);
  const isDashed = borderStyle === "dashed";

  return (
    <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden>
      <rect
        className="fill-none stroke-current"
        width={`calc(100% - ${normalizedStrokeWidth}px)`}
        height={`calc(100% - ${normalizedStrokeWidth}px)`}
        x={inset}
        y={inset}
        rx={rectRadius}
        strokeWidth={normalizedStrokeWidth}
        strokeDasharray={isDashed ? "8 8" : undefined}
      >
        {animate && isDashed ? (
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-16"
            dur="0.4s"
            repeatCount="indefinite"
          />
        ) : null}
      </rect>
    </svg>
  );
};

const Root = forwardRef<HTMLButtonElement, ButtonRootProps>(
  (
    {
      className,
      variant,
      mode,
      size,
      asChild = false,
      showAnimatedBorder = true,
      animateBorder = true,
      animatedBorderStrokeWidth = 2,
      animatedBorderStyle = "dashed",
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const shouldShowAnimatedBorder =
      mode === "animatedBorder" && showAnimatedBorder;

    return (
      <Comp
        ref={ref}
        className={cn(
          buttonRootVariants({ variant, mode, size }),
          className,
          showAnimatedBorder && "border-none",
        )}
        {...props}
      >
        {shouldShowAnimatedBorder ? (
          <DashedBorderSvg
            animate={animateBorder}
            strokeWidth={animatedBorderStrokeWidth}
            borderStyle={animatedBorderStyle}
          />
        ) : null}
        {children}
      </Comp>
    );
  },
);
Root.displayName = "ButtonRoot";

type IconProps<T extends React.ElementType = "span"> = {
  as?: T;
  className?: string;
} & SharedProps &
  Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">;

function Icon<T extends React.ElementType = "span">({
  as,
  className,
  size,
  ...props
}: IconProps<T>) {
  const Comp = (as || "span") as React.ElementType;

  return (
    <Comp className={cn(buttonIconVariants({ size }), className)} {...props} />
  );
}

export { Root, Icon };
