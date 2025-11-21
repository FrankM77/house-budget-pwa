import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// --- DEFINITIONS (Defined right here to stop the import error) ---
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  envelopeId: string;
  reconciled: boolean;
  type: 'Income' | 'Expense' | 'Transfer';
  transferId?: string;
}

export interface Envelope {
  id: string;
  name: string;
  currentBalance: number;
  lastUpdated: string;
  isActive: boolean;
  orderIndex: number;
}

interface BudgetState {
  envelopes: Envelope[];
  transactions: Transaction[];
  addEnvelope: (name: string) => void;
  getTotalBalance: () => number;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      envelopes: [],
      transactions: [],

      addEnvelope: (name) => set((state) => ({
        envelopes: [
          ...state.envelopes,
          {
            id: uuidv4(),
            name,
            currentBalance: 0,
            lastUpdated: new Date().toISOString(),
            isActive: true,
            orderIndex: state.envelopes.length,
          },
        ],
      })),

      getTotalBalance: () => {
        const state = get();
        return state.envelopes
            .filter(e => e.isActive)
            .reduce((sum, e) => sum + e.currentBalance, 0);
      }
    }),
    {
      name: 'house-budget-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
