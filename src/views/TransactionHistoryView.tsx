import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import { useEnvelopeStore } from '../store/envelopeStore';
import EnvelopeTransactionRow from '../components/EnvelopeTransactionRow';
import TransactionModal from '../components/modals/TransactionModal';
import type { Transaction } from '../models/types';

export const TransactionHistoryView: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, envelopes, updateTransaction } = useEnvelopeStore();
  
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Helper: Find the envelope for the transaction being edited
  const activeEnvelope = editingTransaction 
    ? envelopes.find(e => e.id === editingTransaction.envelopeId) 
    : null;

  const handleReconcile = (transaction: Transaction) => {
    const updatedTx = {
      ...transaction,
      reconciled: !transaction.reconciled,
    };
    updateTransaction(updatedTx);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-black border-b dark:border-zinc-800 px-4 py-3 sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-3 text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">All Transactions</h1>
        </div>
        {/* Placeholder for future filters */}
        <button className="text-gray-400 dark:text-zinc-600">
            <Filter size={20} />
        </button>
      </header>

      {/* Transaction List */}
      <div className="p-4 max-w-2xl mx-auto">
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
          {sortedTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-zinc-500">
              No transactions found.
            </div>
          ) : (
            sortedTransactions.map((transaction) => {
              // Lookup envelope for display
              const env = envelopes.find(e => e.id === transaction.envelopeId);
              
              return (
                <EnvelopeTransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  // PASS THE NAME HERE:
                  envelopeName={env?.name || 'Unknown Envelope'}
                  onReconcile={() => handleReconcile(transaction)}
                  onEdit={() => {
                      if (env) {
                          setEditingTransaction(transaction);
                      } else {
                          alert("Cannot edit: Envelope deleted.");
                      }
                  }}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingTransaction && activeEnvelope && (
        <TransactionModal
          isVisible={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          mode="edit"
          currentEnvelope={activeEnvelope}
          initialTransaction={editingTransaction}
        />
      )}
    </div>
  );
};