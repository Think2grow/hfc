import type { BudgetData, Transaction, Category } from './types';
import { getDefaultCategories } from './defaults';

const STORAGE_KEY = 'hfc_budget_data_v1';
const CURRENT_VERSION = 1;

function getInitialData(): BudgetData {
  return {
    version: CURRENT_VERSION,
    categories: getDefaultCategories(),
    transactions: [],
    lastModified: new Date().toISOString(),
  };
}

export function loadBudget(): BudgetData {
  if (typeof window === 'undefined') {
    return getInitialData();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getInitialData();
    }

    const data = JSON.parse(stored) as BudgetData;

    // Schema migration
    if (data.version < CURRENT_VERSION) {
      return migrateData(data);
    }

    return data;
  } catch {
    console.warn('Failed to load budget data, using defaults');
    return getInitialData();
  }
}

export function saveBudget(data: BudgetData): void {
  if (typeof window === 'undefined') return;

  try {
    data.lastModified = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn('Failed to save budget data');
  }
}

export function addTransaction(data: BudgetData, transaction: Omit<Transaction, 'id' | 'createdAt'>): BudgetData {
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  return {
    ...data,
    transactions: [...data.transactions, newTransaction],
  };
}

export function updateTransaction(data: BudgetData, id: string, updates: Partial<Transaction>): BudgetData {
  return {
    ...data,
    transactions: data.transactions.map(t => (t.id === id ? { ...t, ...updates } : t)),
  };
}

export function deleteTransaction(data: BudgetData, id: string): BudgetData {
  return {
    ...data,
    transactions: data.transactions.filter(t => t.id !== id),
  };
}

export function addCategory(data: BudgetData, category: Omit<Category, 'id'>): BudgetData {
  const newCategory: Category = {
    ...category,
    id: Date.now().toString(),
  };
  return {
    ...data,
    categories: [...data.categories, newCategory],
  };
}

export function deleteCategory(data: BudgetData, categoryId: string): BudgetData {
  const inUse = data.transactions.some(t => t.category === categoryId);
  if (inUse) {
    throw new Error('Cannot delete category in use');
  }
  return {
    ...data,
    categories: data.categories.filter(c => c.id !== categoryId),
  };
}

export function updateCategory(data: BudgetData, id: string, updates: Partial<Category>): BudgetData {
  return {
    ...data,
    categories: data.categories.map(c => (c.id === id ? { ...c, ...updates } : c)),
  };
}

export function getTransactionsByDateRange(
  transactions: Transaction[],
  startDate: string,
  endDate: string
): Transaction[] {
  return transactions.filter(t => t.date >= startDate && t.date <= endDate);
}

function migrateData(data: BudgetData): BudgetData {
  // Add migration logic here for future versions
  return { ...data, version: CURRENT_VERSION };
}

export function exportToJSON(data: BudgetData): string {
  return JSON.stringify(data, null, 2);
}

export function importFromJSON(json: string): BudgetData {
  try {
    const data = JSON.parse(json) as BudgetData;
    if (!data.version || !data.categories || !data.transactions) {
      throw new Error('Invalid budget data format');
    }
    return data;
  } catch (error) {
    throw new Error(`Failed to import budget data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
