import type { Budget, BudgetSection, BudgetRow } from './types';

const STORAGE_KEY = 'hfc_budgets_v1';

export function loadBudgets(): Budget[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveBudgets(budgets: Budget[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
}

export function addBudget(budget: Budget) {
  const budgets = loadBudgets();
  budgets.push(budget);
  saveBudgets(budgets);
}

export function updateBudget(updated: Budget) {
  const budgets = loadBudgets().map(b => b.id === updated.id ? updated : b);
  saveBudgets(budgets);
}

export function deleteBudget(id: string) {
  const budgets = loadBudgets().filter(b => b.id !== id);
  saveBudgets(budgets);
}
