import type { BudgetSection } from './types';

export function importBudgetFromJSON(json: string): BudgetSection[] | null {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) return null;
    return data;
  } catch {
    return null;
  }
}

export function exportBudgetToJSON(sections: BudgetSection[]): string {
  return JSON.stringify(sections, null, 2);
}
