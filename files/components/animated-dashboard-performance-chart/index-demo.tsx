import { MotionConfig } from "framer-motion";

import { PerformanceTrend } from "@/components/performance-trend/performance-trend";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Demo() {
  return (
    <TooltipProvider>
      <MotionConfig reducedMotion="user">
        <main className="grid min-h-screen items-center justify-items-center bg-muted/20 p-3 sm:p-5">
          <PerformanceTrend />
        </main>
      </MotionConfig>
    </TooltipProvider>
  );
}
