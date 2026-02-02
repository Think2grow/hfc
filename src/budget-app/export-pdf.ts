import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Budget, BudgetSummary } from './types';

export function exportBudgetToPDF(budget: Budget, summary: BudgetSummary) {
  const doc = new jsPDF();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Monthly Budget Summary', 14, 18);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Income: $${summary.totalIncome.toLocaleString('en-US', {minimumFractionDigits:2})}`, 14, 30);
  doc.text(`Total Expenses: $${summary.totalExpenses.toLocaleString('en-US', {minimumFractionDigits:2})}`, 14, 38);
  doc.text(`Surplus/Deficit: $${summary.surplus.toLocaleString('en-US', {minimumFractionDigits:2})}`, 14, 46);
  doc.text(`Savings Rate: ${(summary.savingsRate*100).toFixed(1)}%`, 14, 54);
  doc.text('50/30/20 Breakdown:', 14, 62);
  doc.text(`Needs: ${(summary.fiftyThirtyTwenty.needs*100).toFixed(1)}%`, 24, 70);
  doc.text(`Wants: ${(summary.fiftyThirtyTwenty.wants*100).toFixed(1)}%`, 24, 78);
  doc.text(`Savings: ${(summary.fiftyThirtyTwenty.savings*100).toFixed(1)}%`, 24, 86);
  // Add more summary as needed
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Full Budget Details', 14, 18);
  // Add tables for each section
  // ...
  doc.save(`${budget.name || 'budget'}.pdf`);
}
