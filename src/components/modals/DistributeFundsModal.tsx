import React, { useState, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { useEnvelopeStore } from '../../store/envelopeStore'; // Correct import path

interface DistributeFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DistributeFundsModal: React.FC<DistributeFundsModalProps> = ({ isOpen, onClose }) => {
  // Use the specific action from your store
  const { envelopes, addToEnvelope } = useEnvelopeStore();
  
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [note, setNote] = useState<string>('');
  
  // Filter active envelopes and sort by orderIndex
  const activeEnvelopes = useMemo(() => 
    envelopes
      .filter(e => e.isActive)
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)), 
  [envelopes]);

  // Computed Math
  const depositValue = parseFloat(depositAmount) || 0;
  
  const totalDistributed = useMemo(() => {
    return Object.values(allocations).reduce((sum, val) => sum + val, 0);
  }, [allocations]);

  const remainingAmount = depositValue - totalDistributed;
  
  // Validation Logic
  const isValid = depositValue > 0 && Math.abs(remainingAmount) < 0.01;

  const handleAllocationChange = (id: string, value: string) => {
    const numValue = parseFloat(value);
    setAllocations(prev => ({
      ...prev,
      [id]: isNaN(numValue) ? 0 : numValue
    }));
  };

  const handleApply = () => {
    if (!isValid) return;

    // Loop through allocations and trigger the store action for each
    Object.entries(allocations).forEach(([id, amount]) => {
      if (amount > 0) {
        // This calls your store's logic which creates a Transaction AND updates currentBalance
        addToEnvelope(id, amount, note || 'Deposit', new Date());
      }
    });
    
    // Reset and Close
    setDepositAmount('');
    setAllocations({});
    setNote('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 sm:bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm shrink-0">
        <button onClick={onClose} className="text-blue-600 font-medium">Cancel</button>
        <h2 className="font-semibold text-gray-900">Distribute Funds</h2>
        <button 
          onClick={handleApply}
          disabled={!isValid}
          className={`font-bold ${isValid ? 'text-blue-600' : 'text-gray-300'}`}
        >
          Apply
        </button>
      </header>

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto pb-20">
        
        {/* Sticky Summary Panel */}
        <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 shadow-sm p-4 space-y-4">
          
          {/* Deposit Input */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-500 mb-1">Deposit Amount</label>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600 mr-2">$</span>
              <input 
                type="number" 
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.00"
                className="text-3xl font-bold text-gray-900 w-full focus:outline-none placeholder-gray-300"
                autoFocus
              />
            </div>
          </div>

          {/* Calculations */}
          <div className="flex justify-between items-center text-sm font-medium px-1">
            <div className="flex flex-col">
              <span className="text-gray-500">Distributed</span>
              <span className="text-gray-900">${totalDistributed.toFixed(2)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-gray-500">Remaining</span>
              <span className={`text-lg ${remainingAmount === 0 ? 'text-green-600' : remainingAmount < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                ${remainingAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Over-allocation Warning */}
          {remainingAmount < -0.01 && (
            <div className="flex items-center text-red-600 text-xs bg-red-50 p-2 rounded border border-red-100">
              <AlertCircle className="w-4 h-4 mr-1" />
              You have over-allocated by ${Math.abs(remainingAmount).toFixed(2)}
            </div>
          )}

          {/* Note Input */}
          <input 
            type="text" 
            placeholder="Distribution Note (Optional)" 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Envelope Allocation List */}
        <div className="p-4 space-y-3">
          {activeEnvelopes.map((env) => {
            const currentAlloc = allocations[env.id] || 0;
            const percent = totalDistributed > 0 ? Math.round((currentAlloc / totalDistributed) * 100) : 0;

            return (
              <div key={env.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{env.name}</h3>
                    {currentAlloc > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                        {percent}%
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {/* Updated to use 'currentBalance' from your store */}
                    Current: ${env.currentBalance.toFixed(2)}
                  </div>
                </div>

                <div className="w-32 relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                   <input 
                      type="number"
                      value={allocations[env.id] === 0 ? '' : allocations[env.id]}
                      onChange={(e) => handleAllocationChange(env.id, e.target.value)}
                      placeholder="0"
                      className="w-full pl-6 pr-3 py-2 text-right bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                   />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};