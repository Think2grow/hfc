import React, { useState, useMemo } from 'react';
import type { BudgetData, Category, TransactionType } from '../../lib/budget/types';
import { addCategory, deleteCategory, updateCategory } from '../../lib/budget/storage';
import AddCategoryModal from './AddCategoryModal';

interface CategoriesViewProps {
  data: BudgetData;
  onDataChange: (data: BudgetData) => void;
  dateRange: [string, string];
}

export default function CategoriesView({ data, onDataChange, dateRange }: CategoriesViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');

  const categoryStats = useMemo(() => {
    const stats: Record<string, { count: number; total: number }> = {};

    data.transactions
      .filter(t => t.date >= dateRange[0] && t.date <= dateRange[1])
      .forEach(t => {
        if (!stats[t.category]) {
          stats[t.category] = { count: 0, total: 0 };
        }
        stats[t.category].count += 1;
        stats[t.category].total += t.amount;
      });

    return stats;
  }, [data.transactions, dateRange]);

  const categoriesInUse = new Set(data.transactions.map(t => t.category));

  const filteredCategories = data.categories.filter(cat =>
    filterType === 'all' ? true : cat.type === filterType
  );

  const onAddCategory = (category: Omit<Category, 'id'>) => {
    const updatedData = addCategory(data, category);
    onDataChange(updatedData);
    setShowModal(false);
  };

  const onUpdateCategory = (id: string, updates: Partial<Category>) => {
    const updatedData = updateCategory(data, id, updates);
    onDataChange(updatedData);
    setEditingId(null);
  };

  const onDeleteCategory = (id: string) => {
    if (categoriesInUse.has(id)) {
      alert('This category has transactions and cannot be deleted. Please delete the transactions first or reassign them.');
      return;
    }
    if (confirm('Are you sure you want to delete this category?')) {
      const updatedData = deleteCategory(data, id);
      onDataChange(updatedData);
    }
  };

  const editingCategory = editingId ? data.categories.find(c => c.id === editingId) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setShowModal(true);
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value as TransactionType | 'all')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map(category => {
          const stats = categoryStats[category.id];
          const inUse = categoriesInUse.has(category.id);

          return (
            <div
              key={category.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: category.color + '20' }}
                >
                  {category.icon || '📍'}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(category.id)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteCategory(category.id)}
                    disabled={inUse}
                    className={`font-medium text-sm ${
                      inUse
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-red-600 hover:text-red-700'
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-xs text-gray-500 mb-4 capitalize">{category.type}</p>

              {stats ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Transactions:</span>
                    <span className="font-semibold text-gray-900">{stats.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className={`font-semibold ${
                      category.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${stats.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No transactions</p>
              )}

              {inUse && (
                <p className="text-xs text-amber-600 mt-4 p-2 bg-amber-50 rounded">
                  ⚠️ This category has transactions and cannot be deleted
                </p>
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        <AddCategoryModal
          onAdd={onAddCategory}
          onClose={() => setShowModal(false)}
        />
      )}

      {editingCategory && (
        <AddCategoryModal
          onAdd={updates => onUpdateCategory(editingCategory.id, updates)}
          onClose={() => setEditingId(null)}
          initialData={editingCategory}
        />
      )}
    </div>
  );
}
