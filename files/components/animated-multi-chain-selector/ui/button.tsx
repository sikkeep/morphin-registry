import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/35 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "rounded-lg bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "rounded-lg border-border bg-background text-foreground hover:bg-muted",
        ghost: "rounded-lg text-foreground hover:bg-muted",
        chainTrigger:
          "border-selector-outline bg-selector-trigger text-foreground shadow-[var(--selector-trigger-shadow)] hover:bg-selector-trigger-hover aria-expanded:bg-selector-trigger",
        chainOption:
          "w-full rounded-none bg-transparent text-muted-foreground hover:bg-selector-row-hover data-[selected=true]:bg-selector-row-selected data-[selected=true]:text-foreground",
      },
      size: {
        default: "h-8 gap-1.5 px-2.5 text-sm",
        sm: "h-7 gap-1 px-2.5 text-[0.8rem]",
        icon: "size-8 rounded-lg",
        chainTrigger:
          "h-11 w-42 justify-start gap-0 rounded-[1.375rem] px-3.5 text-base font-[500] tracking-[-0.025em]",
        chainOption:
          "h-11 justify-start gap-2.5 px-3 text-base font-[450] tracking-[-0.025em]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
