import React, { useState, useEffect } from 'react';
import { loadBudget, saveBudget } from '../lib/budget/storage';
import type { BudgetData } from '../lib/budget/types';
import Dashboard from './budget/Dashboard';
import TransactionsView from './budget/TransactionsView';
import CategoriesView from './budget/CategoriesView';
import Navigation from './budget/Navigation';

type ViewType = 'dashboard' | 'transactions' | 'categories';

export default function BudgetTool() {
  const [data, setData] = useState<BudgetData | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [dateRange, setDateRange] = useState<[string, string]>([
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    new Date().toISOString().split('T')[0],
  ]);

  useEffect(() => {
    const loaded = loadBudget();
    setData(loaded);
  }, []);

  useEffect(() => {
    if (data) {
      saveBudget(data);
    }
  }, [data]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-400">Loading budget tool...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Navigation activeView={activeView} onViewChange={setActiveView} />

        <div className="mt-8">
          {activeView === 'dashboard' && (
            <Dashboard data={data} dateRange={dateRange} onDateRangeChange={setDateRange} onDataChange={setData} />
          )}
          {activeView === 'transactions' && (
            <TransactionsView data={data} onDataChange={setData} dateRange={dateRange} />
          )}
          {activeView === 'categories' && (
            <CategoriesView data={data} onDataChange={setData} />
          )}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Data stays in your browser. Nothing is sent to any server.</p>
        </div>
      </div>
    </div>
  );
}
