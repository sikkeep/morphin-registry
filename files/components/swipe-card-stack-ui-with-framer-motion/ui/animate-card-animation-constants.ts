export interface Card {
  id: number;
  contentType: 1 | 2 | 3;
}

export const cardData = {
  1: {
    title: "Ceramic Tiles",
    description: "Selected by Cosmos",
    image:
      "https://cdn.cosmos.so/f5021c19-c223-4136-a1e1-cd0a5bc6dc17?format=jpeg",
  },
  2: {
    title: "Records",
    description: "Selected by Cosmos",
    image:
      "https://cdn.cosmos.so/c068f203-530a-4c03-b3f7-ac4449bd3d3e?format=jpeg",
  },
  3: {
    title: "Rocks",
    description: "Selected by Cosmos",
    image:
      "https://cdn.cosmos.so/c71f7ab2-b173-4a71-8712-2cd5fb8454fc?format=jpeg",
  },
} as const;

export const initialCards: Card[] = [
  { id: 1, contentType: 1 },
  { id: 2, contentType: 2 },
  { id: 3, contentType: 3 },
];

export const positionStyles = [
  { scale: 1, y: 12 },
  { scale: 0.95, y: -16 },
  { scale: 0.9, y: -44 },
];

export const SWIPE_THRESHOLD = 80;
export const VELOCITY_THRESHOLD = 300;

export const enterAnimation = {
  y: -16,
  scale: 0.9,
};

export const getExitAnimation = () => ({
  y: 340,
  scale: 1,
  zIndex: 10,
});
