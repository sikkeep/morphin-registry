import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// @ts-ignore
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);

export interface ScrollTextEl {
  text: string;
  pos: string;
  altPos: string;
  flipEase?: string;
  scrambleDuration?: number;
  xl?: boolean;
  typingIndicator?: boolean;
}

export interface ScrollTextGroup {
  items: ScrollTextEl[];
}

const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function scramble(
  el: HTMLElement,
  options?: { duration?: number; revealDelay?: number },
): void {
  const rawText = el.dataset.text ?? el.textContent ?? "";
  const duration =
    options?.duration ?? parseFloat(el.dataset.scrambleDuration ?? "1") ?? 1;

  if (duration <= 0) return;

  gsap.killTweensOf(el);

  const chars = [...rawText];
  const escaped = chars.map((c) => escapeHtml(c));
  el.innerHTML = escaped
    .map(
      (c) =>
        `<span class="scroll-char" style="display:inline-block">${c}</span>`,
    )
    .join("");
  const spans = el.querySelectorAll<HTMLSpanElement>(".scroll-char");

  spans.forEach((s, i) => {
    s.dataset.orig = chars[i];
    s.textContent =
      SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
  });

  const tl = gsap.timeline({ delay: options?.revealDelay ?? 0 });
  const steps = Math.max(10, Math.min(20, chars.length));
  const stepDur = duration / steps;

  for (let i = 0; i < steps; i++) {
    tl.call(() => {
      spans.forEach((s) => {
        if (Math.random() < 0.5) {
          s.textContent =
            SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      });
    });
    tl.to({}, { duration: stepDur });
  }
  tl.call(() => {
    spans.forEach((s) => {
      s.textContent = s.dataset.orig ?? "";
    });
  });
}

export function useScrollTextMotion(
  contentRef: RefObject<HTMLDivElement | null>,
  logoRef: RefObject<HTMLSpanElement | null>,
  groups: ScrollTextGroup[],
  logo?: string,
): void {
  useLayoutEffect(() => {
    const content = contentRef.current;
    const logoEl = logoRef.current;
    if (!content) return;

    const textElements = Array.from(
      content.querySelectorAll<HTMLElement>(".scroll-text-el"),
    );

    textElements.forEach((el) => {
      const textEl = el.querySelector(".scroll-text-inner");
      if (textEl) {
        el.dataset.text = textEl.textContent ?? "";
      } else {
        el.dataset.text = el.textContent ?? "";
      }
    });
    if (logoEl) logoEl.dataset.text = logo ?? "";

    const flipTriggers: ScrollTrigger[] = [];
    const scrambleTriggers: ScrollTrigger[] = [];

    function killTriggers(triggers: ScrollTrigger[]) {
      while (triggers.length > 0) {
        triggers.pop()?.kill();
      }
    }

    function resetTextElements() {
      textElements.forEach((el) => {
        gsap.set(el, { clearProps: "transform,opacity,filter" });
      });
    }

    function initFlips() {
      killTriggers(flipTriggers);
      resetTextElements();

      textElements.forEach((el) => {
        const originalClass = [...el.classList].find((c) =>
          c.startsWith("pos-"),
        );
        const targetClass = el.dataset.altPos;
        const flipEase = (el.dataset.flipEase ?? "expo.inOut") as string;

        if (!originalClass || !targetClass) return;

        el.classList.add(targetClass);
        el.classList.remove(originalClass);
        const flipState = Flip.getState(el, {
          props: "opacity, filter, width",
        });
        el.classList.add(originalClass);
        el.classList.remove(targetClass);

        const toTl = Flip.to(flipState, {
          ease: flipEase,
          scrollTrigger: {
            trigger: el,
            start: "bottom bottom-=10%",
            end: "center center",
            scrub: true,
          },
        });
        const fromTl = Flip.from(flipState, {
          ease: flipEase,
          scrollTrigger: {
            trigger: el,
            start: "center center",
            end: "top top",
            scrub: true,
          },
        });

        if (toTl.scrollTrigger) {
          flipTriggers.push(toTl.scrollTrigger);
        }
        if (fromTl.scrollTrigger) {
          flipTriggers.push(fromTl.scrollTrigger);
        }
      });
    }

    function initScramble() {
      killTriggers(scrambleTriggers);

      textElements.forEach((el) => {
        const duration = parseFloat(el.dataset.scrambleDuration ?? "1");
        if (duration <= 0) return;

        const trigger = ScrollTrigger.create({
          id: "scroll-text-scramble",
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onEnter: () => scramble(el),
          onEnterBack: () => scramble(el),
        });
        scrambleTriggers.push(trigger);
      });

      if (logoEl) scramble(logoEl, { revealDelay: 0.5 });
    }

    const handleResize = () => {
      initFlips();
      initScramble();
      ScrollTrigger.refresh(true);
    };

    const ctx = gsap.context(() => {
      initFlips();
      initScramble();
    }, content);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      killTriggers(scrambleTriggers);
      killTriggers(flipTriggers);
      ctx.revert();
    };
  }, [groups, logo]);
}
