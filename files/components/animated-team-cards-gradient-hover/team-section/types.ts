export type TeamCardTheme = "violet" | "amber" | "cyan";

export type TeamMember = Readonly<{
  id: string;
  name: string;
  role: string;
  avatar: string;
  theme: TeamCardTheme;
}>;
