import * as XLSX from 'xlsx';
import type { Budget } from './types';

export function exportBudgetToExcel(budget: Budget) {
  const wb = XLSX.utils.book_new();
  // Monthly Budget tab
  const monthlyRows = budget.sections.flatMap(section =>
    section.rows.map(row => [section.title, row.label, row.amount])
  );
  const ws1 = XLSX.utils.aoa_to_sheet([
    ['Section', 'Label', 'Amount'],
    ...monthlyRows,
  ]);
  XLSX.utils.book_append_sheet(wb, ws1, 'Monthly Budget');
  // TODO: Add 12-Month Projection, Irregular Costs, Goals tabs
  XLSX.writeFile(wb, `${budget.name || 'budget'}.xlsx`);
}
