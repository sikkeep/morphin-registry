import { cn } from "@/lib/utils";

export default function OnlineAnimation({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <div className="absolute top-6 left-6 overflow-hidden rounded-full px-2 py-1 shadow-sm">
        <img
          src="/online-gradient.png"
          alt="Online"
          className="absolute inset-0 z-1 w-full h-full object-cover"
        />
        <div className="relative z-2 flex items-center gap-2">
          <div className="size-2 rounded-full bg-emerald-500"></div>
          <span className="text-xs font-semibold text-black/50">Online</span>
        </div>
      </div>
      <span className="absolute top-6 right-6 text-sm font-semibold text-black/70">
        morphin.dev
      </span>
    </div>
  );
}
