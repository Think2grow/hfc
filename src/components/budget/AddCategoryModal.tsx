import React, { useState } from 'react';
import type { Category } from '../../lib/budget/types';

interface AddCategoryModalProps {
  onAdd: (category: Omit<Category, 'id'>) => void;
  onClose: () => void;
  initialData?: Category;
}

const COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#6366f1', // indigo
  '#14b8a6', // teal
];

const ICONS = ['💰', '💳', '💵', '💸', '🏦', '📊', '📈', '📉', '🎯', '🛍️', '🍔', '🚗', '🏠', '✈️', '📚', '💪', '🎓', '🏥', '🎬', '🎮'];

export default function AddCategoryModal({
  onAdd,
  onClose,
  initialData,
}: AddCategoryModalProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState<'income' | 'expense'>(initialData?.type || 'expense');
  const [color, setColor] = useState(initialData?.color || '#3b82f6');
  const [icon, setIcon] = useState(initialData?.icon || '💰');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter a category name');
      return;
    }

    onAdd({
      name: name.trim(),
      type,
      color,
      icon,
    });

    setName('');
    setType('expense');
    setColor('#3b82f6');
    setIcon('💰');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? 'Edit Category' : 'Add Category'}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Groceries"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="flex gap-2">
              {['income', 'expense'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t as 'income' | 'expense')}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {ICONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`h-10 flex items-center justify-center text-xl rounded-lg transition-all ${
                    icon === emoji
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Color</label>
            <div className="grid grid-cols-5 gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-10 rounded-lg transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
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
