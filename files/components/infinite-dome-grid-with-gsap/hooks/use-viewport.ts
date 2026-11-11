import { useEffect, useState } from 'react';

export interface Viewport {
  width: number;
  height: number;
}

const read = (): Viewport => ({ width: window.innerWidth, height: window.innerHeight });

/** Window size, updated at most once per animation frame. */
export function useViewport(): Viewport {
  const [viewport, setViewport] = useState(read);

  useEffect(() => {
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setViewport(read()));
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return viewport;
}
