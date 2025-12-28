import React from 'react';
import { Target, TrendingDown, CheckCircle } from 'lucide-react';

interface AvailableToBudgetProps {
  amount: number;
  totalIncome: number;
  totalAllocated: number;
  isLoading?: boolean;
}

export const AvailableToBudget: React.FC<AvailableToBudgetProps> = ({
  amount,
  totalIncome,
  totalAllocated,
  isLoading = false,
}) => {
  // Calculate progress percentage
  const progressPercentage = totalIncome > 0 ? ((totalAllocated / totalIncome) * 100) : 0;

  // Determine status and styling
  const isZeroBalance = Math.abs(amount) < 0.01;
  const isOverAllocated = amount < 0;
  const isUnderAllocated = amount > 0;

  const getStatusConfig = () => {
    if (isZeroBalance) {
      return {
        icon: CheckCircle,
        color: 'text-green-600 dark:text-emerald-400',
        bgColor: 'bg-green-50 dark:bg-emerald-900/20',
        borderColor: 'border-green-200 dark:border-emerald-800',
        title: 'Budget Balanced!',
        subtitle: 'Every dollar has a job',
      };
    } else if (isOverAllocated) {
      return {
        icon: TrendingDown,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        title: 'Over Budget',
        subtitle: 'Reduce allocations or add income',
      };
    } else {
      return {
        icon: Target,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        title: 'Available to Budget',
        subtitle: 'Assign money to envelopes',
      };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 dark:bg-zinc-700 rounded w-32"></div>
          <div className="h-8 bg-gray-200 dark:bg-zinc-700 rounded w-20"></div>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-zinc-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-6 border ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
            <StatusIcon size={24} className={statusConfig.color} />
          </div>
          <div>
            <h3 className={`font-semibold ${statusConfig.color}`}>
              {statusConfig.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              {statusConfig.subtitle}
            </p>
          </div>
        </div>

        {/* Main Amount */}
        <div className="text-right">
          <div className={`text-3xl font-bold ${statusConfig.color}`}>
            {isOverAllocated ? '-' : ''}${Math.abs(amount).toFixed(2)}
          </div>
          {isZeroBalance && (
            <div className="text-sm text-green-600 dark:text-emerald-400 font-medium">
              Perfect Balance
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {!isZeroBalance && totalIncome > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-zinc-400">
            <span>Allocated</span>
            <span>{progressPercentage.toFixed(0)}% of income</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                isOverAllocated
                  ? 'bg-red-500'
                  : isUnderAllocated
                    ? 'bg-blue-500'
                    : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-500">
            <span>${totalAllocated.toFixed(2)} allocated</span>
            <span>${totalIncome.toFixed(2)} income</span>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              ${totalIncome.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 dark:text-zinc-400">
              Total Income
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              ${totalAllocated.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 dark:text-zinc-400">
              Allocated
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
