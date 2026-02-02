import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import type { Budget } from './types';
import { loadBudgets, saveBudgets } from './storage';

const initial = loadBudgets();

export const budgets = writable<Budget[]>(initial);

budgets.subscribe((val) => saveBudgets(val));

export function createNewBudget(name: string, sections: any[]): Budget {
  return {
    id: uuidv4(),
    name,
    created: new Date().toISOString(),
    sections,
  };
}
