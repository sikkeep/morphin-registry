import { Globe, MessageSquare, Monitor, Smartphone } from "lucide-react";
import { ScreenTimeCard } from "@/components/screen-time-card";

export default function ScreenTimeCardDemo() {
  const sampleBarData = [
    20, 15, 10, 8, 12, 25, 35, 45, 60, 75, 80, 85, 70, 65, 55, 50, 60, 75, 80,
    90, 85, 75, 60, 50,
  ];

  const topApps = [
    {
      icon: (
        <MessageSquare className="h-5 w-5 text-blue-500" strokeWidth={2.5} />
      ),
      name: "Messages",
      duration: "10h 1m",
    },
    {
      icon: <Globe className="h-5 w-5 text-orange-500" strokeWidth={2.5} />,
      name: "Chrome",
      duration: "4h 23m",
    },
    {
      icon: (
        <Smartphone className="h-5 w-5 text-purple-500" strokeWidth={2.5} />
      ),
      name: "Social",
      duration: "2h 38m",
    },
    {
      icon: <Monitor className="h-5 w-5 text-gray-500" strokeWidth={2.5} />,
      name: "Other",
      duration: "1h 29m",
    },
  ];

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-4">
      <ScreenTimeCard
        totalHours={23}
        totalMinutes={2}
        barData={sampleBarData}
        timeLabels={["5 AM", "11 AM", "5 PM"]}
        topApps={topApps}
      />
    </div>
  );
}
