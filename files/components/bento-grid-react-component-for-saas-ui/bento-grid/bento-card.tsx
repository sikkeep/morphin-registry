import { ComponentPropsWithoutRef, ComponentType, Fragment } from "react";

import { cn } from "@/lib/utils";

export interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  description: string;
  backgroundImage: string;
  backgroundImageClassName: string;
  className: string;
  animation?: ComponentType<{ className: string }>;
  animationClassName?: string;
  type: "small" | "default";
}

export default function BentoCard({
  description,
  backgroundImage,
  backgroundImageClassName,
  className,
  animation,
  animationClassName,
  type = "default",
}: BentoCardProps) {
  const Animation = animation;

  const descriptionLines = description.split("\n");

  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden border border-neutral-100",
        className,
      )}
    >
      <img src={backgroundImage} alt="" className={backgroundImageClassName} />

      <div className={cn("absolute inset-0 z-3 rounded-2xl flex flex-col p-6")}>
        <h3
          className={cn(
            "text-xl leading-tight font-medium -tracking-[0.02em] md:text-2xl lg:text-[28px] text-gray-8",
            type === "small" && "mt-auto",
          )}
        >
          {descriptionLines.map((line, index) => (
            <Fragment key={index}>
              <span
                className={cn(
                  descriptionLines.length > 1 &&
                    index - (1 % 2) &&
                    "opacity-50",
                )}
              >
                {line}
              </span>
              {index < descriptionLines.length - 1 && <br />}
            </Fragment>
          ))}
        </h3>
      </div>

      {Animation && <Animation className={animationClassName} />}
    </div>
  );
}
