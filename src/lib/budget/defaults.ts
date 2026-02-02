import type { Category, TransactionType } from './types';

const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', type: 'income', color: '#10b981', icon: '💼' },
  { id: 'freelance', name: 'Freelance', type: 'income', color: '#3b82f6', icon: '💻' },
  { id: 'investment', name: 'Investment', type: 'income', color: '#f59e0b', icon: '📈' },
  { id: 'bonus', name: 'Bonus', type: 'income', color: '#8b5cf6', icon: '🎁' },
  { id: 'other-income', name: 'Other', type: 'income', color: '#6b7280', icon: '📊' },
];

const EXPENSE_CATEGORIES: Category[] = [
  { id: 'housing', name: 'Housing', type: 'expense', color: '#ef4444', icon: '🏠' },
  { id: 'utilities', name: 'Utilities', type: 'expense', color: '#f97316', icon: '💡' },
  { id: 'groceries', name: 'Groceries', type: 'expense', color: '#ec4899', icon: '🛒' },
  { id: 'transportation', name: 'Transportation', type: 'expense', color: '#06b6d4', icon: '🚗' },
  { id: 'insurance', name: 'Insurance', type: 'expense', color: '#6366f1', icon: '🛡️' },
  { id: 'healthcare', name: 'Healthcare', type: 'expense', color: '#14b8a6', icon: '🏥' },
  { id: 'dining', name: 'Dining & Food', type: 'expense', color: '#f43f5e', icon: '🍽️' },
  { id: 'entertainment', name: 'Entertainment', type: 'expense', color: '#a855f7', icon: '🎬' },
  { id: 'shopping', name: 'Shopping', type: 'expense', color: '#d946ef', icon: '👜' },
  { id: 'subscriptions', name: 'Subscriptions', type: 'expense', color: '#0ea5e9', icon: '📱' },
  { id: 'debt', name: 'Debt Payments', type: 'expense', color: '#dc2626', icon: '💳' },
  { id: 'savings', name: 'Savings', type: 'expense', color: '#059669', icon: '🏦' },
  { id: 'other-expense', name: 'Other', type: 'expense', color: '#6b7280', icon: '📝' },
];

export function getDefaultCategories(): Category[] {
  return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
}

export function getCategoriesByType(type: TransactionType): Category[] {
  return getDefaultCategories().filter(cat => cat.type === type);
}
