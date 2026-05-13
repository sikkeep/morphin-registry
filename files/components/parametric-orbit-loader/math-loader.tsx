import { cn } from "@/lib/utils";

type MathLoaderProps = {
  className?: string;
  label?: string;
};

const VIEWBOX_SIZE = 256;
const CENTER = VIEWBOX_SIZE / 2;
const SCALE = 12.2;
const POINTS = 960;
const LOOP_DURATION = "2.8s";
const tailSegments = Array.from({ length: 18 }, (_, index) => {
  const progress = index / 17;
  const length = 4 + progress * 31;
  const opacity = 0.018 + progress ** 1.85 * 0.19;

  return {
    length: Number(length.toFixed(2)),
    opacity: opacity.toFixed(3),
  };
});

function trochoidPath(d: number) {
  const step = (Math.PI * 2) / POINTS;
  const commands: string[] = [];

  for (let index = 0; index <= POINTS; index += 1) {
    const t = index * step;
    // x = 7cos(t) - d*cos(7t), y = 7sin(t) - d*sin(7t)
    const x = 7 * Math.cos(t) - d * Math.cos(7 * t);
    const y = 7 * Math.sin(t) - d * Math.sin(7 * t);
    const command = index === 0 ? "M" : "L";

    commands.push(
      `${command} ${(CENTER + x * SCALE).toFixed(3)} ${(CENTER + y * SCALE).toFixed(3)}`,
    );
  }

  return `${commands.join(" ")} Z`;
}

const mainPath = trochoidPath(2.74);

export function MathLoader({
  className,
  label = "Loading",
}: MathLoaderProps) {
  return (
    <div
      className={cn(
        "relative grid size-[min(76vw,136px)] place-items-center overflow-hidden bg-black",
        className,
      )}
      role="status"
      aria-label={label}
    >
      <svg
        className="size-[82%] overflow-visible"
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        aria-hidden="true"
      >
        <defs>
          <filter id="loader-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feColorMatrix
              in="blur"
              result="glow"
              type="matrix"
              values="1 0 0 0 1  0 1 0 0 1  0 0 1 0 1  0 0 0 .7 0"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g>
          <path
            d={mainPath}
            className="fill-none stroke-white/18"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="100"
          />
          {tailSegments.map(({ length, opacity }) => (
            <path
              key={length}
              d={mainPath}
              className="fill-none stroke-white"
              opacity={opacity}
              strokeWidth="19"
              strokeLinecap="butt"
              strokeLinejoin="round"
              strokeDasharray={`${length} ${100 - length}`}
              strokeDashoffset={length}
              pathLength="100"
            >
              <animate
                attributeName="stroke-dashoffset"
                from={length}
                to={length - 100}
                dur={LOOP_DURATION}
                repeatCount="indefinite"
              />
            </path>
          ))}
          <path
            d={mainPath}
            className="fill-none stroke-white/95"
            filter="url(#loader-glow)"
            strokeWidth="19"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="47 53"
            strokeDashoffset="0"
            pathLength="100"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-100"
              dur={LOOP_DURATION}
              repeatCount="indefinite"
            />
          </path>
          <path
            d={mainPath}
            className="fill-none stroke-white/65"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="47 53"
            strokeDashoffset="0"
            pathLength="100"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-100"
              dur={LOOP_DURATION}
              repeatCount="indefinite"
            />
          </path>
        </g>
      </svg>

      <span className="sr-only">{label}</span>
    </div>
  );
}
