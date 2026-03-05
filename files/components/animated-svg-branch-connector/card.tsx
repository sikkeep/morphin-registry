import { cn } from "@/lib/utils";

import Cross from "@/components/ui/cross";

export default function Card({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full border border-neutral-900 bg-black flex flex-col",
        className,
      )}
    >
      {children}
      <div className="p-5 flex-grow">
        <h2 className="text-xl font-bold text-white mb-2 truncate line-clamp-1">
          {title}
        </h2>
        <p className="text-gray-300 text-sm line-clamp-2">{description}</p>
      </div>

      {Array.from({ length: 4 }).map((_, index) => (
        <Cross
          className={cn(
            "absolute size-5",
            index === 0 && "-top-[11px] -left-[11px]",
            index === 1 && "-top-[11px] -right-[11px]",
            index === 2 && "-bottom-[11px] -right-[11px]",
            index === 3 && "-bottom-[11px] -left-[11px]",
          )}
        />
      ))}
    </div>
  );
}
