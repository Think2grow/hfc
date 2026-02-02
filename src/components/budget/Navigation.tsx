import React from 'react';

interface NavigationProps {
  activeView: 'dashboard' | 'transactions' | 'categories';
  onViewChange: (view: 'dashboard' | 'transactions' | 'categories') => void;
}

export default function Navigation({ activeView, onViewChange }: NavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'transactions', label: 'Transactions', icon: '📝' },
    { id: 'categories', label: 'Categories', icon: '🏷️' },
  ] as const;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex gap-1">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onViewChange(tab.id)}
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            activeView === tab.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
