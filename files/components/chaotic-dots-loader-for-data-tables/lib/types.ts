export type UserStatus = "Active" | "Invited" | "Blocked";

export type User = {
  id: number;
  name: string;
  email: string;
  team: string;
  role: string;
  status: UserStatus;
};