"use client";

import Logo from "./ui/logo";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Customers", href: "#customers" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md px-5 py-4">
      <nav className="mx-auto flex max-w-7xl w-full items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <Logo className="size-7 text-white" />
          <span className="text-lg font-bold text-neutral-50">morphin.dev</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm text-neutral-400 transition-colors hover:text-neutral-50"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
