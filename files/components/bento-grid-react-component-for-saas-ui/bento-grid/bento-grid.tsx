import BentoCard, {
  type BentoCardProps,
} from "@/components/bento-grid/bento-card";
import NotificationAnimation from "@/components/bento-grid/notification-animation";
import OnlineAnimation from "@/components/bento-grid/online-animation";
import CircleAnimation from "@/components/bento-grid/circle-animation";
import EmojiAnimation from "@/components/bento-grid/emoji-animation";

const features = [
  {
    description: "More than\n10 million users\naround the world",
    backgroundImage: "/pastel-gradient-v3.png",
    backgroundImageClassName: "absolute inset-0 z-1 w-full h-full object-cover",
    className: "rounded-3xl md:col-span-1 md:row-span-1",
    animation: OnlineAnimation,
    animationClassName: "absolute inset-0 z-2",
    type: "small",
  },
  {
    description:
      "Never think about SEO again with\nbuilt-in clean tags, correct links,\nand properly sized images.",
    backgroundImage: "/pastel-gradient.png",
    backgroundImageClassName: "absolute inset-0 z-1 w-full h-full object-cover",
    className: "rounded-3xl md:col-span-2 md:row-span-2",
    animation: NotificationAnimation,
    animationClassName:
      "absolute bottom-0 md:left-0 right-0 z-2 scale-75 sm:scale-100 sm:max-w-[350px] md:max-w-full w-full max-h-[250px]",
    type: "default",
  },
  {
    description: "Connect with\neveryone at once",
    backgroundImage: "/pastel-gradient-v2.png",
    backgroundImageClassName: "absolute inset-0 z-1 w-full h-full object-cover",
    animation: CircleAnimation,
    animationClassName:
      "absolute -top-20 sm:top-12 -right-20 sm:-right-0 md:left-0 mx-auto scale-70 z-2 max-w-[200px] max-h-[200px]",
    className: "rounded-3xl md:col-span-1 md:row-span-2",
    type: "small",
  },
  {
    description: "React with\nthe perfect emoji.",
    backgroundImage: "/pastel-gradient.png",
    backgroundImageClassName:
      "absolute inset-0 -scale-100 z-1 w-full h-full object-cover",
    className: "rounded-3xl md:col-span-2 md:row-span-1",
    animation: EmojiAnimation,
    animationClassName: "absolute inset-0 z-2",
    type: "default",
  },
] satisfies BentoCardProps[];

export default function BentoGrid() {
  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 auto-rows-[190px] gap-3 sm:gap-4">
      {features.map((feature) => (
        <BentoCard key={feature.description} {...feature} />
      ))}
    </div>
  );
}
