export type NavItem = {
  label: string;
  description?: string;
  href?: string;
};

export type NavColumn = {
  heading: string;
  items: NavItem[];
  accent?: boolean;
};

export type NavMenu = {
  id: string;
  columns: NavColumn[];
};

export type NavLink = {
  label: string;
  href?: string;
  menu?: NavMenu;
};

export const NAV_LINKS: NavLink[] = [
  {
    label: "Products",
    menu: {
      id: "products",
      columns: [
        {
          heading: "Platform",
          items: [
            { label: "Overview", description: "See the full platform" },
            { label: "Analytics", description: "Track and measure" },
            { label: "Integrations", description: "Connect your tools" },
          ],
        },
        {
          heading: "Features",
          items: [
            { label: "Automation", description: "Streamline workflows" },
            { label: "Reporting", description: "Generate insights" },
            { label: "AI", description: "Build custom integrations" },
          ],
        },
        {
          heading: "Infrastructure",
          accent: true,
          items: [
            { label: "Cloud", description: "Managed hosting" },
            { label: "Security", description: "Enterprise grade" },
          ],
        },
      ],
    },
  },
  {
    label: "Solutions",
    menu: {
      id: "solutions",
      columns: [
        {
          heading: "By Use Case",
          items: [
            { label: "SaaS", description: "Sell online at scale" },
            { label: "E-commerce", description: "Subscription businesses" },
            { label: "Marketplaces", description: "Multi-vendor platforms" },
            { label: "Platforms", description: "Built on top of Osmo" },
            { label: "Creator economy", description: "Monetize your audience" },
          ],
        },
        {
          heading: "By Industries",
          items: [
            { label: "Healthcare", description: "HIPAA compliant" },
            { label: "Finance", description: "Secure services" },
            { label: "Education", description: "Learning tools" },
            { label: "Retail", description: "Omnichannel commerce" },
          ],
        },
        {
          heading: "By Size",
          items: [
            { label: "Startups", description: "Launch faster" },
            { label: "Enterprise", description: "Scale with confidence" },
          ],
        },
        {
          heading: "Quick Links",
          accent: true,
          items: [
            { label: "Customer stories" },
            { label: "Partners" },
            { label: "Professional services" },
            { label: "Migrations" },
            { label: "Compare plans" },
          ],
        },
      ],
    },
  },
  {
    label: "Company",
    menu: {
      id: "company",
      columns: [
        {
          heading: "About",
          items: [
            { label: "Our story", description: "How we got here" },
            { label: "Team", description: "Meet the people" },
            { label: "Careers", description: "Join us" },
          ],
        },
        {
          heading: "Resources",
          items: [
            { label: "Blog", description: "Latest thinking" },
            { label: "Press", description: "News and media" },
            { label: "Events", description: "Where we'll be" },
          ],
        },
        {
          heading: "Legal",
          accent: true,
          items: [
            { label: "Privacy policy" },
            { label: "Terms of service" },
            { label: "Security" },
          ],
        },
      ],
    },
  },
  {
    label: "Pricing",
    href: "#",
  },
];
