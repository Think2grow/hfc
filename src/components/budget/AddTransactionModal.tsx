import React, { useState } from 'react';
import type { Transaction, Category } from '../../lib/budget/types';

interface AddTransactionModalProps {
  categories: Category[];
  onAdd: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onClose: () => void;
  initialData?: Transaction;
}

const ICONS = ['💰', '💳', '💵', '💸', '🏦', '📊', '📈', '📉', '🎯', '🛍️', '🍔', '🚗', '🏠', '✈️', '📚'];

export default function AddTransactionModal({
  categories,
  onAdd,
  onClose,
  initialData,
}: AddTransactionModalProps) {
  const [type, setType] = useState<'income' | 'expense'>(initialData?.type || 'expense');
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');
  const [categoryId, setCategoryId] = useState(initialData?.category || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState(initialData?.note || '');

  const relevantCategories = categories.filter(c => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !categoryId) {
      alert('Please fill in all required fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    onAdd({
      type,
      amount: numAmount,
      category: categoryId,
      date,
      note,
    });

    setType('expense');
    setAmount('');
    setCategoryId('');
    setDate(new Date().toISOString().split('T')[0]);
    setNote('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="flex gap-2">
              {['income', 'expense'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setType(t as 'income' | 'expense');
                    setCategoryId('');
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors capitalize ${
                    type === t
                      ? t === 'income'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            {relevantCategories.length > 0 ? (
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {relevantCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-red-600">No {type} categories available</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a note (optional)"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {initialData ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
