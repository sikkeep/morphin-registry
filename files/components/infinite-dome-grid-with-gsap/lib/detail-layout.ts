export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetailLayout {
  /** Panel size; it is centred on the viewport. */
  width: number;
  height: number;
  /** Image frame, relative to the panel (inset so the photo floats in the card). */
  media: Box;
  /** Text column, relative to the panel. */
  content: Box;
  orientation: 'row' | 'column';
  radius: number;
  mediaRadius: number;
}

const round = Math.round;

/** Final geometry of the open project panel for a viewport. */
export function getDetailLayout(vw: number, vh: number): DetailLayout {
  if (vw >= 768) {
    const inset = 10;
    const height = round(Math.min(vh * 0.76, 700));
    const width = round(Math.min(vw - 96, height * 1.9));
    const side = Math.min(height - inset * 2, round(width * 0.54));
    const media = { x: inset, y: inset, width: side, height: height - inset * 2 };
    return {
      width,
      height,
      media,
      content: { x: media.x + media.width, y: 0, width: width - media.x - media.width, height },
      orientation: 'row',
      radius: 26,
      mediaRadius: 18,
    };
  }

  const inset = 8;
  const width = round(vw - 24);
  const mediaHeight = round(Math.min(width * 0.82, vh * 0.42));
  const height = round(Math.min(vh - 40, mediaHeight + inset + 330));
  const media = { x: inset, y: inset, width: width - inset * 2, height: mediaHeight };
  return {
    width,
    height,
    media,
    content: { x: 0, y: media.y + media.height, width, height: height - media.y - media.height },
    orientation: 'column',
    radius: 22,
    mediaRadius: 15,
  };
}
