import { Component } from "@/components/animated-menu";

const navigationItems = [
  { name: "Home", href: "/", description: "[0]" },
  { name: "Components", href: "/components", description: "[1]" },
  { name: "Pricing", href: "/pricing", description: "[2]" },
  { name: "How to use", href: "/docs/quick-start", description: "[3]" },
  { name: "Account", href: "/user", description: "[4]" },
  { name: "Login", href: "/login", description: "[7]" },
];

export default function AnimatedMenuDemo() {
  return (
    <ul className="flex min-h-full w-full flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl px-7 py-3 backdrop-blur-sm">
      {navigationItems.map((item, index) => (
        <li
          className="relative flex cursor-pointer flex-col items-center overflow-visible"
          key={index}
        >
          <div className="relative flex items-start">
            <Component
              center
              className="text-4xl font-extrabold uppercase leading-[0.8] tracking-[-0.03em] transition-colors lg:text-5xl"
            >
              {item.name}
            </Component>
          </div>
        </li>
      ))}
    </ul>
  );
}
