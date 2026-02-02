import type { BudgetSection, BudgetSummary } from './types';

export function calculateSummary(sections: BudgetSection[]): BudgetSummary {
  const income = sumSection(sections, 'income');
  const fixed = sumSection(sections, 'fixed');
  const variable = sumSection(sections, 'variable');
  const irregular = sumSection(sections, 'irregular');
  const totalExpenses = fixed + variable + irregular;
  const surplus = income - totalExpenses;
  const savingsRate = income > 0 ? surplus / income : 0;

  // 50/30/20 rule
  const needs = fixed + irregular;
  const wants = variable;
  const savings = surplus > 0 ? surplus : 0;
  const total = income;
  const ftt = {
    needs: total > 0 ? needs / total : 0,
    wants: total > 0 ? wants / total : 0,
    savings: total > 0 ? savings / total : 0,
  };

  // Warnings and encouragements
  const warnings: string[] = [];
  const encouragements: string[] = [];
  if (fixed > 0.35 * income) warnings.push('Housing > 35% of income');
  if (findRow(sections, 'debt') > 0.15 * income) warnings.push('Debt minimums > 15% of income');
  if ((findRow(sections, 'dining') + findRow(sections, 'shopping')) > 0.15 * income) warnings.push('Dining + Shopping > 15% of income');
  if (savings < 0.2 * income) encouragements.push('Try to save at least 20% of your income!');

  return {
    totalIncome: income,
    totalFixed: fixed,
    totalVariable: variable,
    totalIrregular: irregular,
    totalExpenses,
    surplus,
    savingsRate,
    fiftyThirtyTwenty: ftt,
    warnings,
    encouragements,
  };
}

function sumSection(sections: BudgetSection[], type: string) {
  const section = sections.find(s => s.type === type);
  return section ? section.rows.reduce((sum, r) => sum + (r.amount || 0), 0) : 0;
}

function findRow(sections: BudgetSection[], id: string) {
  for (const s of sections) {
    const row = s.rows.find(r => r.id === id);
    if (row) return row.amount || 0;
  }
  return 0;
}
