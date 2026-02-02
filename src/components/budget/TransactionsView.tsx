import React, { useState, useMemo } from 'react';
import type { BudgetData, Transaction, TransactionType } from '../../lib/budget/types';
import { addTransaction, updateTransaction, deleteTransaction } from '../../lib/budget/storage';
import AddTransactionModal from './AddTransactionModal';

interface TransactionsViewProps {
  data: BudgetData;
  onDataChange: (data: BudgetData) => void;
  dateRange: [string, string];
}

export default function TransactionsView({ data, onDataChange, dateRange }: TransactionsViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    return data.transactions
      .filter(t => t.date >= dateRange[0] && t.date <= dateRange[1])
      .filter(t => (filterType === 'all' ? true : t.type === filterType))
      .filter(t => (filterCategory === 'all' ? true : t.category === filterCategory))
      .filter(t => {
        const cat = data.categories.find(c => c.id === t.category);
        return (
          t.amount.toString().includes(search) ||
          cat?.name.toLowerCase().includes(search.toLowerCase()) ||
          t.note?.toLowerCase().includes(search.toLowerCase())
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data, dateRange, filterType, filterCategory, search]);

  const onAddTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const updatedData = addTransaction(data, transaction);
    onDataChange(updatedData);
    setShowModal(false);
  };

  const onUpdateTransaction = (id: string, updates: Partial<Transaction>) => {
    const updatedData = updateTransaction(data, id, updates);
    onDataChange(updatedData);
    setEditingId(null);
  };

  const onDeleteTransaction = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      const updatedData = deleteTransaction(data, id);
      onDataChange(updatedData);
    }
  };

  const editingTransaction = editingId ? data.transactions.find(t => t.id === editingId) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setShowModal(true);
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Add Transaction
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
        <input
          type="text"
          placeholder="Search by amount, category, or note..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as TransactionType | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {data.categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => {
            const category = data.categories.find(c => c.id === transaction.category);
            return (
              <div
                key={transaction.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: category?.color + '20' }}
                    >
                      {category?.icon || '📍'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{category?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                      {transaction.note && <p className="text-sm text-gray-600 mt-1">{transaction.note}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`font-bold text-lg ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{transaction.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(transaction.id)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(transaction.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No transactions found</p>
          </div>
        )}
      </div>

      {showModal && (
        <AddTransactionModal
          categories={data.categories}
          onAdd={onAddTransaction}
          onClose={() => setShowModal(false)}
        />
      )}

      {editingTransaction && (
        <AddTransactionModal
          categories={data.categories}
          onAdd={updates => onUpdateTransaction(editingTransaction.id, updates)}
          onClose={() => setEditingId(null)}
          initialData={editingTransaction}
        />
      )}
    </div>
  );
}
