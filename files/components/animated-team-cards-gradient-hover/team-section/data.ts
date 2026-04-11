import type { TeamMember } from "./types";

export const MEMBERS = [
  {
    id: "ethan-carter",
    name: "Ethan Carter",
    role: "Product Owner",
    avatar: "https://i.pravatar.cc/240?img=12",
    theme: "violet",
  },
  {
    id: "james-anderson",
    name: "James Anderson",
    role: "Business Analyst",
    avatar: "https://i.pravatar.cc/240?img=33",
    theme: "amber",
  },
  {
    id: "liam-bennett",
    name: "Liam Bennett",
    role: "Product Manager",
    avatar: "https://i.pravatar.cc/240?img=52",
    theme: "cyan",
  },
] satisfies readonly TeamMember[];
