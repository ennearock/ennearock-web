import type { AccountUser } from "@/lib/auth/account";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export type Project = {
  id: string;
  name: string;
  status: "draft" | "active" | "paused" | "completed" | "archived";
  custom_domain: string | null;
  updated_at: string;
};

export type Inquiry = {
  id: string;
  subject: string;
  message: string;
  status: "new" | "in-progress" | "resolved" | "spam";
  created_at: string;
  updated_at: string;
};

export type AccountData = {
  user: AccountUser;
  projects: Project[];
  inquiries: Inquiry[];
  loadError: string | null;
};
