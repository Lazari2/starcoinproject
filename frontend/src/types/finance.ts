export type AccountType = "income" | "expense" | "both";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type CategoryKind = "income" | "expense";

export interface Category {
  id: string;
  name: string;
  kind: CategoryKind;
  color: string; // hsl token like "152 76% 52%"
  icon?: string;
  monthlyLimit?: number; // only for expense
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO
  categoryId: string;
  accountId: string;
  kind: "income" | "expense";
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export type Period = "week" | "month" | "year" | "all";
