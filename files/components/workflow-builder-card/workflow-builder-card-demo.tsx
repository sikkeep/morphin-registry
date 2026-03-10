import { Code, Share2, Zap } from "lucide-react";
import { WorkflowBuilderCard } from "@/components/workflow-builder-card";

const cardData = {
  imageUrl:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&q=80&auto=format&fit=crop",
  status: "Active" as const,
  lastUpdated: "5 days ago",
  title: "Personal Email Assistant",
  description:
    "Your AI helper for reading, organizing, and responding to emails.",
  tags: ["Personal", "Marketing"],
  users: [
    { src: "https://i.pravatar.cc/150?img=1", fallback: "U1" },
    { src: "https://i.pravatar.cc/150?img=2", fallback: "U2" },
    { src: "https://i.pravatar.cc/150?img=3", fallback: "U3" },
    { src: "https://i.pravatar.cc/150?img=4", fallback: "+3" },
  ],
  actions: [
    { Icon: Zap, bgColor: "bg-blue-500" },
    { Icon: Code, bgColor: "bg-gray-700" },
    { Icon: Share2, bgColor: "bg-red-500" },
  ],
};

export default function WorkflowBuilderCardDemo() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-4">
      <WorkflowBuilderCard {...cardData} />
    </div>
  );
}
