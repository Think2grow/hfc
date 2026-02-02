// src/budget-app/types.ts

export type BudgetRow = {
  id: string;
  label: string;
  amount: number;
  editable?: boolean;
};

export type BudgetSection = {
  title: string;
  rows: BudgetRow[];
  type: 'income' | 'fixed' | 'variable' | 'irregular' | 'goal';
};

export type Budget = {
  id: string;
  name: string;
  created: string;
  sections: BudgetSection[];
};

export type BudgetSummary = {
  totalIncome: number;
  totalFixed: number;
  totalVariable: number;
  totalIrregular: number;
  totalExpenses: number;
  surplus: number;
  savingsRate: number;
  fiftyThirtyTwenty: {
    needs: number;
    wants: number;
    savings: number;
  };
  warnings: string[];
  encouragements: string[];
};
