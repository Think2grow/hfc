import React, { useState, useMemo } from 'react';
import type { BudgetData, Transaction } from '../../lib/budget/types';
import PieChart from './PieChart';
import AddTransactionModal from './AddTransactionModal';
import { addTransaction } from '../../lib/budget/storage';

interface DashboardProps {
  data: BudgetData;
  dateRange: [string, string];
  onDateRangeChange: (range: [string, string]) => void;
  onDataChange?: (data: BudgetData) => void;
}

export default function Dashboard({ data, dateRange, onDateRangeChange, onDataChange }: DashboardProps) {
  const [showModal, setShowModal] = useState(false);
  const filteredTransactions = useMemo(() => {
    return data.transactions.filter(
      t => t.date >= dateRange[0] && t.date <= dateRange[1]
    );
  }, [data.transactions, dateRange]);

  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const net = income - expenses;

    return {
      income,
      expenses,
      net,
      savingsRate: income > 0 ? (net / income) * 100 : 0,
    };
  }, [filteredTransactions]);

  const expenseByCategory = useMemo(() => {
    const grouped: Record<string, number> = {};
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        grouped[t.category] = (grouped[t.category] || 0) + t.amount;
      });

    const total = Object.values(grouped).reduce((a, b) => a + b, 0);
    return Object.entries(grouped)
      .map(([catId, amount]) => {
        const category = data.categories.find(c => c.id === catId);
        return {
          name: category?.name || 'Unknown',
          value: amount,
          color: category?.color || '#6b7280',
          percentage: total > 0 ? (amount / total) * 100 : 0,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions, data.categories]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Budget Dashboard</h1>
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <input
            type="month"
            value={`${dateRange[0].slice(0, 7)}`}
            onChange={e => {
              const date = new Date(e.target.value);
              const start = date.toISOString().split('T')[0];
              const end = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
              onDateRangeChange([start, end]);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700"
          />
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Add Transaction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Income" value={stats.income} color="green" />
        <StatCard label="Total Expenses" value={stats.expenses} color="red" />
        <StatCard label="Net Income" value={stats.net} color={stats.net >= 0 ? 'blue' : 'orange'} />
        <StatCard label="Savings Rate" value={`${stats.savingsRate.toFixed(1)}%`} color="purple" isPercent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Expenses by Category</h2>
          {expenseByCategory.length > 0 ? (
            <PieChart data={expenseByCategory} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No expenses recorded yet
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-900 font-medium">Total Income</span>
              <span className="text-green-700 font-bold text-lg">${stats.income.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-red-900 font-medium">Total Expenses</span>
              <span className="text-red-700 font-bold text-lg">${stats.expenses.toFixed(2)}</span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded-lg ${
              stats.net >= 0 ? 'bg-blue-50' : 'bg-orange-50'
            }`}>
              <span className={`font-medium ${stats.net >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
                Net Income
              </span>
              <span className={`font-bold text-lg ${stats.net >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                ${stats.net.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-purple-900 font-medium">Savings Rate</span>
              <span className="text-purple-700 font-bold text-lg">{stats.savingsRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <AddTransactionModal
          categories={data.categories}
          onAdd={(transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
            const updatedData = addTransaction(data, transaction);
            if (onDataChange) {
              onDataChange(updatedData);
            }
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  color: 'green' | 'red' | 'blue' | 'orange' | 'purple';
  isPercent?: boolean;
}

function StatCard({ label, value, color, isPercent }: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-900',
    red: 'bg-red-50 border-red-200 text-red-900',
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    orange: 'bg-orange-50 border-orange-200 text-orange-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg border-2 p-6 text-center`}>
      <p className="text-sm font-medium opacity-75 mb-1">{label}</p>
      <p className="text-3xl font-bold">{isPercent ? value : `$${typeof value === 'number' ? value.toFixed(2) : value}`}</p>
    </div>
  );
}
