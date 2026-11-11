import type { CSSProperties, Ref } from 'react';
import type { Project } from '@/data/projects';

interface ProjectModalContentProps {
  project: Project;
  index: number;
  total: number;
  titleId: string;
  style: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Text side of the open panel. Elements marked `data-reveal` fade up in
 * sequence; `data-title` slides up from behind its overflow mask.
 */
export function ProjectModalContent({ project, index, total, titleId, style, ref }: ProjectModalContentProps) {
  return (
    <div
      ref={ref}
      style={style}
      className="absolute flex flex-col px-6 pt-5 pb-6 text-neutral-950 md:px-[clamp(28px,3.4vw,56px)] md:py-[clamp(28px,3vw,44px)]"
    >
      <div data-reveal className="flex items-center gap-3 pr-12 text-xs">
        <span className="font-mono text-neutral-400 tabular-nums">
          {pad(index + 1)} / {pad(total)}
        </span>
        <span aria-hidden className="h-px w-6 bg-neutral-200" />
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-medium text-neutral-700">{project.category}</span>
      </div>

      <div className="my-auto py-5 md:py-8">
        <h2
          id={titleId}
          className="overflow-hidden pb-[0.08em] text-[clamp(30px,3.6vw,58px)] leading-[1.02] font-medium tracking-[-0.035em]"
        >
          <span data-title className="block">
            {project.title}
          </span>
        </h2>
        <p
          data-reveal
          className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-pretty text-neutral-500 md:mt-5 md:text-base"
        >
          {project.description}
        </p>
      </div>

      <dl data-reveal className="grid grid-cols-[1.2fr_1.4fr_0.6fr] gap-4 border-t border-neutral-200/80 pt-4 text-sm md:pt-5">
        <Field label="Client" value={project.client} />
        <Field label="Services" value={project.services.join(', ')} />
        <Field label="Year" value={String(project.year)} />
      </dl>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-neutral-400">{label}</dt>
      <dd className="mt-1 text-[13px] leading-snug text-neutral-800 md:text-sm">{value}</dd>
    </div>
  );
}
