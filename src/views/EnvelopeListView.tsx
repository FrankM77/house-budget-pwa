import React, { useState } from 'react';
import { PlusCircle, Settings, List as ListIcon, GitBranch, Wallet, Check } from 'lucide-react';
import { useEnvelopeStore } from '../store/envelopeStore';
import { DistributeFundsModal } from '../components/modals/DistributeFundsModal';
import { useNavigate } from 'react-router-dom';

export const EnvelopeListView: React.FC = () => {
  const { envelopes } = useEnvelopeStore();
  const [isDistributeOpen, setIsDistributeOpen] = useState(false);
  const navigate = useNavigate();

  // Sort envelopes by orderIndex
  const sortedEnvelopes = [...envelopes].sort(
    (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
  );

  // Calculate Total Balance dynamically from current envelope balances
  const totalBalance = envelopes.reduce(
    (sum, env) => sum + env.currentBalance,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b px-4 py-3 sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">House Expenses</h1>
        <div className="flex gap-4 text-blue-600">
          <button onClick={() => navigate('/transactions')}>
            <ListIcon size={22} />
          </button>
          <button onClick={() => navigate('/settings')}>
            <Settings size={22} />
          </button>
        </div>
      </nav>

      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Section 1: Total Balance & Distribute Button */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total Balance</span>
            <span
              className={`text-2xl font-bold ${
                totalBalance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ${totalBalance.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => setIsDistributeOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-3 rounded-xl font-semibold active:bg-blue-100 transition-colors"
          >
            <GitBranch size={20} className="rotate-90" />
            Distribute Funds
          </button>
        </section>

        {/* Section 2: Envelope List */}
        <section>
          {sortedEnvelopes.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <Wallet className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-gray-500 font-medium">No envelopes yet</h3>
              <button
                onClick={() => navigate('/add-envelope')}
                className="text-blue-600 font-medium"
              >
                Create First Envelope
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* List Header */}
              <div className="flex justify-between items-end px-1">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  My Envelopes
                </h2>
                <button
                  className="text-sm text-blue-600 font-medium"
                  onClick={() => navigate('/add-envelope')}
                >
                  + New Envelope
                </button>
              </div>

              {/* List Items */}
              {sortedEnvelopes.map((env) => (
                <div
                  key={env.id}
                  onClick={() => navigate(`/envelope/${env.id}`)}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center active:scale-[0.99] transition-transform cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      {env.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        env.currentBalance < 0
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      ${env.currentBalance.toFixed(2)}
                    </span>
                    <Check
                      size={16}
                      className={
                        env.currentBalance < 0
                          ? 'text-red-500'
                          : 'text-green-500'
                      }
                      fill="currentColor"
                      fillOpacity={0.2}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Global Floating Action Button */}
      <button
        onClick={() => navigate('/add-transaction')}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg active:scale-90 transition-transform"
      >
        <PlusCircle size={28} />
      </button>

      {/* Modals */}
      <DistributeFundsModal
        isOpen={isDistributeOpen}
        onClose={() => setIsDistributeOpen(false)}
      />
    </div>
  );
};