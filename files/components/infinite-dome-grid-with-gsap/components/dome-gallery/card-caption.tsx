import type { Ref } from 'react';

interface CardCaptionProps {
  title?: string;
  meta?: string;
  ref?: Ref<HTMLDivElement>;
  titleRef?: Ref<HTMLSpanElement>;
  metaRef?: Ref<HTMLSpanElement>;
}

/**
 * Title bottom-left, "Category, Year" bottom-right over a soft scrim.
 * Shared by grid tiles (filled imperatively through refs) and the opening
 * panel (filled through props) so the morph starts from an identical card.
 */
export function CardCaption({ title, meta, ref, titleRef, metaRef }: CardCaptionProps) {
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-linear-to-t from-black/45 to-transparent px-[7%] pt-16 pb-[6%] text-white"
    >
      <span ref={titleRef} className="truncate text-[clamp(13px,1.05vw,16px)] font-medium tracking-tight">
        {title}
      </span>
      <span ref={metaRef} className="shrink-0 text-[clamp(10px,0.75vw,12px)] text-white/70">
        {meta}
      </span>
    </div>
  );
}

export const formatMeta = (category: string, year: number) => `${category}, ${year}`;
