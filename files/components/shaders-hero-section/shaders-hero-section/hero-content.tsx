export function HeroContent() {
  return (
    <main className="absolute bottom-8 left-8 z-20 max-w-lg">
      <div className="text-left">
        <div
          className="relative mb-4 inline-flex items-center rounded-full bg-white/5 px-3 py-1 backdrop-blur-sm"
          style={{ filter: "url(#glass-effect)" }}
        >
          <div className="absolute left-1 right-1 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <span className="relative z-10 text-xs font-light text-white/90">
            ✨ New Paper Shaders Experience
          </span>
        </div>

        <h1 className="mb-4 text-5xl font-light tracking-tight text-white md:text-6xl md:leading-16">
          <span className="font-medium italic">Beautiful</span> Shader
          <br />
          <span className="font-light tracking-tight text-white">
            Experiences
          </span>
        </h1>

        <p className="mb-4 text-xs font-light leading-relaxed text-white/70">
          Create stunning visual experiences with our advanced shader
          technology. Interactive lighting, smooth animations, and beautiful
          effects that respond to your every move.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button className="cursor-pointer rounded-full border border-white/30 bg-transparent px-8 py-3 text-xs font-normal text-white transition-all duration-200 hover:border-white/50 hover:bg-white/10">
            Pricing
          </button>
          <button className="cursor-pointer rounded-full bg-white px-8 py-3 text-xs font-normal text-black transition-all duration-200 hover:bg-white/90">
            Get Started
          </button>
        </div>
      </div>
    </main>
  );
}
