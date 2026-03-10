export function Header() {
  return (
    <header className="relative z-20 flex items-center justify-between p-6">
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 126 126"
          className="fill-white w-10"
          fill="currentColor"
        >
          <path d="M32 32h31v-.5A31.5 31.5 0 1 0 31.5 63h.5ZM94 32v31h.5A31.5 31.5 0 1 0 63 31.5v.5ZM32 94V63h-.5A31.5 31.5 0 1 0 63 94.5V94ZM94.5 63H94v31H63v.5A31.5 31.5 0 1 0 94.5 63Z"></path>
          <path d="M63 32a31.5 31.5 0 0 1-31 31 31.5 31.5 0 0 1 31 31 31.5 31.5 0 0 1 31-31 31.5 31.5 0 0 1-31-31Z"></path>
        </svg>
      </div>

      <nav className="flex items-center space-x-2">
        <a
          href="#"
          className="rounded-full px-3 py-2 text-xs font-light text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          Features
        </a>
        <a
          href="#"
          className="rounded-full px-3 py-2 text-xs font-light text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          Pricing
        </a>
        <a
          href="#"
          className="rounded-full px-3 py-2 text-xs font-light text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          Docs
        </a>
      </nav>

      <div
        className="group relative flex items-center"
        style={{ filter: "url(#gooey-filter)" }}
      >
        <button className="absolute right-0 z-0 flex h-8 -translate-x-10 cursor-pointer items-center justify-center rounded-full bg-white px-2.5 py-2 text-xs font-normal text-black transition-all duration-300 hover:bg-white/90 group-hover:-translate-x-19">
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 17L17 7M17 7H7M17 7V17"
            />
          </svg>
        </button>
        <button className="z-10 flex h-8 cursor-pointer items-center rounded-full bg-white px-6 py-2 text-xs font-normal text-black transition-all duration-300 hover:bg-white/90">
          Login
        </button>
      </div>
    </header>
  );
}
