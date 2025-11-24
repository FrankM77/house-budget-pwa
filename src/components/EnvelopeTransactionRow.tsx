import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import type { Transaction } from '../models/types';

interface Props {
  transaction: Transaction;
  onReconcile: () => void;
  onEdit: () => void;
  envelopeName?: string; // <--- This is the new prop needed
}

// Helper to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Helper to format date
const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const EnvelopeTransactionRow: React.FC<Props> = ({ transaction, onReconcile, onEdit, envelopeName }) => {
  // 1. Determine Colors
  const isIncome = transaction.type === 'Income';
  const amountColor = isIncome 
    ? 'text-green-600 dark:text-emerald-400' 
    : 'text-red-600 dark:text-red-400';
  
  const amountPrefix = isIncome ? '+' : '-';

  // 2. Determine Badge Label
  const badgeLabel = transaction.transferId ? 'Transfer' : transaction.type;

  return (
    <div 
      onClick={onEdit}
      className="flex justify-between items-start p-4 cursor-pointer transition-colors duration-150 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 group border-b border-gray-100 dark:border-zinc-800 last:border-0"
    >
      {/* LEFT SIDE: Info Column */}
      <div className="flex flex-col gap-1 flex-1 pr-4">
        {/* Description */}
        <p className="text-gray-900 dark:text-white font-bold text-base leading-tight">
          {transaction.description}
        </p>
        
        {/* Date */}
        <p className="text-xs text-gray-500 dark:text-zinc-500">
          {formatDate(transaction.date)}
        </p>

        {/* Envelope Name (Only shows if prop is passed from History View) */}
        {envelopeName && (
          <p className="text-xs font-medium text-gray-400 dark:text-zinc-400 mt-0.5">
            {envelopeName}
          </p>
        )}
      </div>

      {/* RIGHT SIDE: Numbers & Actions */}
      <div className="flex flex-col items-end gap-2">
        
        {/* Top Row: Amount + Checkbox */}
        <div className="flex items-center gap-3">
          <span className={`font-bold text-base ${amountColor}`}>
            {amountPrefix}{formatCurrency(transaction.amount)}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onReconcile();
            }}
            className="p-1 -mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
          >
            {transaction.reconciled ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-emerald-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-300 dark:text-zinc-600 group-hover:text-gray-400 dark:group-hover:text-zinc-500" />
            )}
          </button>
        </div>

        {/* Bottom Row: Badge */}
        <span className="bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">
          {badgeLabel}
        </span>

      </div>
    </div>
  );
};

export default EnvelopeTransactionRow;