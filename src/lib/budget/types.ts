export type TransactionType = 'income' | 'expense';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annual';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  recurrence: RecurrenceType;
  note?: string;
  createdAt: string;
}

export interface BudgetData {
  version: number;
  categories: Category[];
  transactions: Transaction[];
  lastModified: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
}
