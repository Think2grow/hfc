import type { BudgetSection } from './types';

export const defaultIncome: BudgetSection = {
  title: 'Income',
  type: 'income',
  rows: [
    { id: 'primary', label: 'Primary Income', amount: 0, editable: true },
    { id: 'secondary', label: 'Secondary Income', amount: 0, editable: true },
    { id: 'side', label: 'Side Hustle', amount: 0, editable: true },
    { id: 'bonus', label: 'Bonuses / Commissions', amount: 0, editable: true },
    { id: 'other', label: 'Other', amount: 0, editable: true },
  ],
};

export const defaultFixed: BudgetSection = {
  title: 'Fixed Expenses',
  type: 'fixed',
  rows: [
    { id: 'rent', label: 'Rent / Mortgage', amount: 0, editable: true },
    { id: 'utilities', label: 'Utilities', amount: 0, editable: true },
    { id: 'phone', label: 'Phone', amount: 0, editable: true },
    { id: 'internet', label: 'Internet', amount: 0, editable: true },
    { id: 'insurance', label: 'Insurance', amount: 0, editable: true },
    { id: 'car', label: 'Car Payment', amount: 0, editable: true },
    { id: 'subs', label: 'Subscriptions', amount: 0, editable: true },
    { id: 'childcare', label: 'Childcare', amount: 0, editable: true },
    { id: 'debt', label: 'Debt Minimums', amount: 0, editable: true },
    { id: 'other', label: 'Other', amount: 0, editable: true },
    { id: 'blank1', label: '', amount: 0, editable: true },
    { id: 'blank2', label: '', amount: 0, editable: true },
    { id: 'blank3', label: '', amount: 0, editable: true },
  ],
};

export const defaultVariable: BudgetSection = {
  title: 'Variable Expenses',
  type: 'variable',
  rows: [
    { id: 'groceries', label: 'Groceries', amount: 0, editable: true },
    { id: 'gas', label: 'Gas', amount: 0, editable: true },
    { id: 'dining', label: 'Dining', amount: 0, editable: true },
    { id: 'entertainment', label: 'Entertainment', amount: 0, editable: true },
    { id: 'shopping', label: 'Shopping', amount: 0, editable: true },
    { id: 'personal', label: 'Personal', amount: 0, editable: true },
    { id: 'household', label: 'Household', amount: 0, editable: true },
    { id: 'kids', label: 'Kids', amount: 0, editable: true },
    { id: 'misc', label: 'Misc', amount: 0, editable: true },
    { id: 'other', label: 'Other', amount: 0, editable: true },
    { id: 'blank1', label: '', amount: 0, editable: true },
    { id: 'blank2', label: '', amount: 0, editable: true },
    { id: 'blank3', label: '', amount: 0, editable: true },
  ],
};

export const defaultIrregular: BudgetSection = {
  title: 'Irregular / Annual Costs',
  type: 'irregular',
  rows: [
    { id: 'carrepairs', label: 'Car Repairs', amount: 0, editable: true },
    { id: 'medical', label: 'Medical', amount: 0, editable: true },
    { id: 'gifts', label: 'Gifts', amount: 0, editable: true },
    { id: 'travel', label: 'Travel', amount: 0, editable: true },
    { id: 'homemaint', label: 'Home Maintenance', amount: 0, editable: true },
    { id: 'annualins', label: 'Annual Insurance', amount: 0, editable: true },
  ],
};

export const defaultGoals: BudgetSection = {
  title: 'Goals',
  type: 'goal',
  rows: [
    { id: 'emergency', label: 'Emergency Fund', amount: 0, editable: true },
    { id: 'debtpayoff', label: 'Debt Payoff', amount: 0, editable: true },
    { id: 'savings', label: 'Savings Goal', amount: 0, editable: true },
  ],
};
