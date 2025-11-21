import React, { useState } from 'react';
import { Plus, Settings, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBudgetStore } from '../viewmodels/useBudgetStore';
import { formatCurrency } from '../utils/formatters'; // We'll create this helper

export const EnvelopeListView: React.FC = () => {
  // Access the store
  const { envelopes, getTotalBalance, addEnvelope } = useBudgetStore();
  
  // Local state for the "Add Envelope" popup
  const [isAdding, setIsAdding] = useState(false);
  const [newEnvelopeName, setNewEnvelopeName] = useState('');

  const totalIncome = 0; // We can calculate this later from transaction history if needed
  const totalExpenses = 0; // Same here
  const remaining = getTotalBalance();

  const handleCreateEnvelope = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEnvelopeName.trim()) {
      addEnvelope(newEnvelopeName);
      setNewEnvelopeName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">House Budget</h1>
        <div className="flex gap-4">
          <Link to="/settings" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Settings className="w-6 h-6" />
          </Link>
          <button 
            onClick={() => setIsAdding(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Dashboard Card */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Monthly Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center font-bold text-3xl mt-2">
              <span>Total</span>
              <span className={remaining >= 0 ? "text-green-500" : "text-red-500"}>
                ${remaining.toFixed(2)}
              </span>
            </div>
          </div>
        </section>

        {/* Envelopes List */}
        <div className="space-y-3">
            {envelopes.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                    No envelopes created yet. Tap + to start.
                </div>
            ) : (
                envelopes.map(env => (
                    <div key={env.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                                <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div>
                                <h3 className="font-medium">{env.name}</h3>
                                <p className="text-xs text-gray-400">Updated: {new Date(env.lastUpdated).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <span className={`font-bold ${env.currentBalance < 0 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                            ${env.currentBalance.toFixed(2)}
                        </span>
                    </div>
                ))
            )}
        </div>
      </main>

      {/* Simple Modal for Adding Envelope */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-sm">
                <h2 className="text-lg font-bold mb-4">New Envelope</h2>
                <form onSubmit={handleCreateEnvelope}>
                    <input 
                        autoFocus
                        type="text" 
                        placeholder="Rent, Groceries, etc."
                        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 mb-4 border-none focus:ring-2 focus:ring-blue-500"
                        value={newEnvelopeName}
                        onChange={e => setNewEnvelopeName(e.target.value)}
                    />
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">Create</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};