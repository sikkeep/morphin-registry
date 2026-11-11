export interface Project {
  id: string;
  title: string;
  category: string;
  year: number;
  description: string;
  client: string;
  services: string[];
  image: string;
  alt: string;
}

const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}.webp`;

export const projects: Project[] = [
  {
    id: 'basecamp',
    title: 'Basecamp',
    category: 'Editorial',
    year: 2025,
    description: 'A field journal for an outdoor label, told from inside the tent at first light.',
    client: 'Wildgrove Outfitters',
    services: ['Art direction', 'Editorial'],
    image: img('field-notes'),
    alt: 'View through an open tent onto a pine forest',
  },
  {
    id: 'granite',
    title: 'Granite',
    category: 'Campaign',
    year: 2026,
    description: 'A climbing brand relaunch built around the scale and silence of a single wall.',
    client: 'Ascent Supply Co.',
    services: ['Campaign', 'Photography'],
    image: img('granite'),
    alt: 'Granite cliff rising above a pine valley',
  },
  {
    id: 'long-road',
    title: 'Long Road',
    category: 'Motion',
    year: 2026,
    description: 'Title sequence for a road documentary, cut to the rhythm of passing lane markings.',
    client: 'Open Lane Films',
    services: ['Motion', 'Title design'],
    image: img('long-road'),
    alt: 'Empty desert road leading between red rock formations',
  },
  {
    id: 'northbound',
    title: 'Northbound',
    category: 'Identity',
    year: 2025,
    description: 'Visual identity for an alpine expedition company, drawn from the line above the clouds.',
    client: 'Northbound Expeditions',
    services: ['Identity', 'Wayfinding'],
    image: img('northbound'),
    alt: 'Snowy peaks above a sea of clouds at sunset',
  },
  {
    id: 'mesa',
    title: 'Mesa',
    category: 'Packaging',
    year: 2026,
    description: 'A range of desert-dyed goods, packaged in the colours of the land it comes from.',
    client: 'Desert Thread',
    services: ['Packaging', 'Art direction'],
    image: img('red-mesa'),
    alt: 'Red sandstone buttes under a blue sky',
  },
  {
    id: 'shoreline',
    title: 'Shoreline',
    category: 'Web',
    year: 2025,
    description: 'An interactive tide guide where the interface rises and falls with the water.',
    client: 'Tidewatch',
    services: ['Web', 'Interaction'],
    image: img('shoreline'),
    alt: 'Waves rolling onto a rocky shore under a violet sky',
  },
  {
    id: 'still-air',
    title: 'Still Air',
    category: 'Product',
    year: 2024,
    description: 'Launch film for a quiet air purifier, shot over layered hills at dawn.',
    client: 'Calm Air',
    services: ['Product film', '3D'],
    image: img('still-air'),
    alt: 'Layered misty hills fading into a pale sky',
  },
];
