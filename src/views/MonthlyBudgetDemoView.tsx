import React, { useEffect, useState } from 'react';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { useMonthlyBudgetStore } from '../stores/monthlyBudgetStore';
import { MonthSelector } from '../components/ui/MonthSelector';
import { AvailableToBudget } from '../components/ui/AvailableToBudget';
import { UserMenu } from '../components/ui/UserMenu';
import { mockMonthlyBudgetData, mockEnvelopeNames } from '../utils/demoData';

export const MonthlyBudgetDemoView: React.FC = () => {
  const {
    currentMonth,
    incomeSources,
    envelopeAllocations,
    isLoading,
    setCurrentMonth,
    fetchMonthlyData,
    calculateAvailableToBudget,
    copyFromPreviousMonth,
    loadDemoData,
  } = useMonthlyBudgetStore();

  const [demoLoaded, setDemoLoaded] = useState(false);

  // Load mock data for demo on mount
  useEffect(() => {
    const initializeDemo = () => {
      if (!demoLoaded) {
        // Set current month to match demo data
        setCurrentMonth(mockMonthlyBudgetData.currentMonth);

        // Load demo data into store
        loadDemoData(mockMonthlyBudgetData.incomeSources, mockMonthlyBudgetData.envelopeAllocations);

        setDemoLoaded(true);
      }
    };

    initializeDemo();
  }, [demoLoaded, setCurrentMonth, loadDemoData]);

  // Load data on mount and when month changes
  useEffect(() => {
    if (demoLoaded) {
      fetchMonthlyData();
    }
  }, [currentMonth, fetchMonthlyData, demoLoaded]);

  const availableToBudget = calculateAvailableToBudget();
  const totalIncome = incomeSources.reduce((sum, source) => sum + source.amount, 0);
  const totalAllocated = envelopeAllocations.reduce((sum, allocation) => sum + allocation.budgetedAmount, 0);

  // Get envelope name from mock data
  const getEnvelopeName = (envelopeId: string) => {
    return mockEnvelopeNames[envelopeId] || `Envelope ${envelopeId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      {/* Header with Sync Status */}
      <header className="bg-white dark:bg-black border-b dark:border-zinc-800 px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          {/* Demo Status */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-blue-500">
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              <span className="text-sm font-medium">
                {isLoading ? 'Loading...' : 'Demo Ready'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={copyFromPreviousMonth}
              className="text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 transition-colors text-sm font-medium"
              disabled={isLoading}
            >
              Copy Month
            </button>
            <UserMenu />
          </div>
        </div>

        <div className="mt-4">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Zero-Based Budget Demo
          </h1>
          <p className="text-gray-600 dark:text-zinc-400 mt-1">
            EveryDollar-style monthly budgeting
          </p>
        </div>
      </header>

      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Month Selector */}
        <MonthSelector
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
        />

        {/* Available to Budget - Main Focus */}
        <AvailableToBudget
          amount={availableToBudget}
          totalIncome={totalIncome}
          totalAllocated={totalAllocated}
          isLoading={isLoading}
        />

        {/* Income Sources Section */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Income Sources
            </h2>
            <button className="text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 transition-colors">
              <PlusCircle size={20} />
            </button>
          </div>

          {incomeSources.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 dark:text-zinc-400 text-sm">
                No income sources yet. Add your monthly income to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {incomeSources.map((source) => (
                <div
                  key={source.id}
                  className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-zinc-800 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {source.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400 capitalize">
                      {source.frequency}
                    </p>
                  </div>
                  <p className="font-semibold text-green-600 dark:text-emerald-400">
                    ${source.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Envelope Allocations Section */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Envelope Allocations
            </h2>
            <button className="text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 transition-colors">
              <PlusCircle size={20} />
            </button>
          </div>

          {envelopeAllocations.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 dark:text-zinc-400 text-sm">
                No allocations yet. Fund envelopes from your available budget.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {envelopeAllocations.map((allocation) => (
                <div
                  key={allocation.id}
                  className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-zinc-800 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {getEnvelopeName(allocation.envelopeId)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      Budgeted this month
                    </p>
                  </div>
                  <p className="font-semibold text-blue-600 dark:text-blue-400">
                    ${allocation.budgetedAmount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Demo Instructions */}
        <section className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Demo Instructions
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Use month selector to navigate between months</li>
            <li>• "Copy Month" copies data from previous month</li>
            <li>• Available to Budget shows your zero-based progress</li>
            <li>• Goal: Get Available to Budget to $0.00</li>
          </ul>
        </section>
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg active:scale-90 transition-transform"
        onClick={() => {/* Add transaction logic */}}
      >
        <PlusCircle size={28} />
      </button>
    </div>
  );
};
