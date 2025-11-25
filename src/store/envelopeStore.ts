import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Envelope, Transaction, DistributionTemplate } from '../models/types'; // Make sure DistributionTemplate is in types.ts

interface EnvelopeState {
  envelopes: Envelope[];
  transactions: Transaction[];
  distributionTemplates: DistributionTemplate[]; // <--- ADDED

  // Envelope actions
  addEnvelope: (name: string, initialBalance: number) => void;
  deleteEnvelope: (id: string) => void;
  renameEnvelope: (id: string, newName: string) => void;
  
  // Transaction actions
  addToEnvelope: (envelopeId: string, amount: number, note: string, date?: Date | string) => void;
  spendFromEnvelope: (envelopeId: string, amount: number, note: string, date?: Date | string) => void;
  updateTransaction: (updatedTx: Transaction) => void;
  transferFunds: (fromEnvelopeId: string, toEnvelopeId: string, amount: number, note: string, date?: Date | string) => void;
  deleteTransaction: (transactionId: string) => void;
  restoreTransaction: (transaction: Transaction) => void;

  // Template actions
  saveTemplate: (name: string, distributions: Record<string, number>, note?: string) => void; // <--- ADDED
  deleteTemplate: (id: string) => void; // <--- ADDED
}

export const useEnvelopeStore = create<EnvelopeState>()(
  persist(
    (set) => ({
      envelopes: [],
      transactions: [],
      distributionTemplates: [], // <--- ADDED

      // Add a new envelope with optional initial balance
      addEnvelope: (name: string, initialBalance: number = 0) => {
        const newEnvelope: Envelope = {
          id: uuidv4(),
          name,
          currentBalance: initialBalance,
          lastUpdated: new Date().toISOString(),
          isActive: true,
          orderIndex: 0,
        };

        set((state) => ({
          envelopes: [...state.envelopes, newEnvelope],
        }));

        if (initialBalance > 0) {
          const initialTransaction: Transaction = {
            id: uuidv4(),
            date: new Date().toISOString(),
            amount: initialBalance,
            description: 'Initial balance',
            envelopeId: newEnvelope.id,
            reconciled: false,
            type: 'Income',
          };

          set((state) => ({
            transactions: [...state.transactions, initialTransaction],
          }));
        }
      },

      // Delete an envelope, its transactions, AND clean up templates
      deleteEnvelope: (id: string) => {
        set((state) => {
            // 1. Remove Envelope & Transactions
            const newEnvelopes = state.envelopes.filter((env) => env.id !== id);
            const newTransactions = state.transactions.filter((tx) => tx.envelopeId !== id);

            // 2. Clean up Templates (Remove reference to this envelope)
            const newTemplates = state.distributionTemplates
              .map((template) => {
                const newDistributions = { ...template.distributions };
                if (newDistributions[id]) {
                  delete newDistributions[id];
                }
                return { ...template, distributions: newDistributions };
              })
              // Remove empty templates
              .filter((template) => Object.keys(template.distributions).length > 0);

            return {
              envelopes: newEnvelopes,
              transactions: newTransactions,
              distributionTemplates: newTemplates,
            };
        });
      },

      // Rename an envelope
      renameEnvelope: (id: string, newName: string) => {
        set((state) => ({
          envelopes: state.envelopes.map((env) =>
            env.id === id ? { ...env, name: newName } : env
          ),
        }));
      },

      // Add money to an envelope (income)
      addToEnvelope: (envelopeId: string, amount: number, note: string, date?: Date | string) => {
        const transactionDate = date
          ? typeof date === 'string'
            ? date
            : date.toISOString()
          : new Date().toISOString();

        const newTransaction: Transaction = {
          id: uuidv4(),
          date: transactionDate,
          amount,
          description: note,
          envelopeId,
          reconciled: false,
          type: 'Income',
        };

        set((state) => ({
          transactions: [...state.transactions, newTransaction],
          envelopes: state.envelopes.map((env) =>
            env.id === envelopeId
              ? {
                  ...env,
                  currentBalance: env.currentBalance + amount,
                  lastUpdated: new Date().toISOString(),
                }
              : env
          ),
        }));
      },

      // Spend money from an envelope (expense)
      spendFromEnvelope: (envelopeId: string, amount: number, note: string, date?: Date | string) => {
        const transactionDate = date
          ? typeof date === 'string'
            ? date
            : date.toISOString()
          : new Date().toISOString();

        const newTransaction: Transaction = {
          id: uuidv4(),
          date: transactionDate,
          amount,
          description: note,
          envelopeId,
          reconciled: false,
          type: 'Expense',
        };

        set((state) => ({
          transactions: [...state.transactions, newTransaction],
          envelopes: state.envelopes.map((env) =>
            env.id === envelopeId
              ? {
                  ...env,
                  currentBalance: env.currentBalance - amount,
                  lastUpdated: new Date().toISOString(),
                }
              : env
          ),
        }));
      },

      // Transfer funds between envelopes
      transferFunds: (fromEnvelopeId: string, toEnvelopeId: string, amount: number, note: string, date?: Date | string) => {
        set((state) => {
          const transactionDate = date
            ? typeof date === 'string'
              ? date
              : date.toISOString()
            : new Date().toISOString();

          const fromEnvelope = state.envelopes.find((env) => env.id === fromEnvelopeId);
          const toEnvelope = state.envelopes.find((env) => env.id === toEnvelopeId);

          if (!fromEnvelope || !toEnvelope) {
            console.warn('One or both envelopes not found');
            return state;
          }

          const transferId = uuidv4();

          const expenseTransaction: Transaction = {
            id: uuidv4(),
            date: transactionDate,
            amount,
            description: `Transfer to ${toEnvelope.name}`,
            envelopeId: fromEnvelopeId,
            reconciled: false,
            type: 'Expense',
            transferId,
          };

          const incomeTransaction: Transaction = {
            id: uuidv4(),
            date: transactionDate,
            amount,
            description: `Transfer from ${fromEnvelope.name}`,
            envelopeId: toEnvelopeId,
            reconciled: false,
            type: 'Income',
            transferId,
          };

          if (note) {
            expenseTransaction.description += ` (${note})`;
            incomeTransaction.description += ` (${note})`;
          }

          return {
            transactions: [...state.transactions, expenseTransaction, incomeTransaction],
            envelopes: state.envelopes.map((env) => {
              if (env.id === fromEnvelopeId) {
                return {
                  ...env,
                  currentBalance: env.currentBalance - amount,
                  lastUpdated: new Date().toISOString(),
                };
              } else if (env.id === toEnvelopeId) {
                return {
                  ...env,
                  currentBalance: env.currentBalance + amount,
                  lastUpdated: new Date().toISOString(),
                };
              }
              return env;
            }),
          };
        });
      },

      // Update an existing transaction and adjust envelope balance
      updateTransaction: (updatedTx: Transaction) => {
        set((state) => {
          const oldTransaction = state.transactions.find((tx) => tx.id === updatedTx.id);
          
          if (!oldTransaction) {
            console.warn('Transaction not found');
            return state;
          }

          let balanceAdjustment = 0;

          if (oldTransaction.envelopeId !== updatedTx.envelopeId) {
            const oldAmount = oldTransaction.type === 'Income' ? -oldTransaction.amount : oldTransaction.amount;
            const newAmount = updatedTx.type === 'Income' ? updatedTx.amount : -updatedTx.amount;

            return {
              transactions: state.transactions.map((tx) =>
                tx.id === updatedTx.id ? updatedTx : tx
              ),
              envelopes: state.envelopes.map((env) => {
                if (env.id === oldTransaction.envelopeId) {
                  return {
                    ...env,
                    currentBalance: env.currentBalance + oldAmount,
                    lastUpdated: new Date().toISOString(),
                  };
                } else if (env.id === updatedTx.envelopeId) {
                  return {
                    ...env,
                    currentBalance: env.currentBalance + newAmount,
                    lastUpdated: new Date().toISOString(),
                  };
                }
                return env;
              }),
            };
          }

          if (oldTransaction.type === updatedTx.type) {
            const amountDiff = updatedTx.amount - oldTransaction.amount;
            balanceAdjustment = updatedTx.type === 'Income' ? amountDiff : -amountDiff;
          } else {
            const revertOld = oldTransaction.type === 'Income' ? -oldTransaction.amount : oldTransaction.amount;
            const applyNew = updatedTx.type === 'Income' ? updatedTx.amount : -updatedTx.amount;
            balanceAdjustment = revertOld + applyNew;
          }

          return {
            transactions: state.transactions.map((tx) =>
              tx.id === updatedTx.id ? updatedTx : tx
            ),
            envelopes: state.envelopes.map((env) =>
              env.id === updatedTx.envelopeId
                ? {
                    ...env,
                    currentBalance: env.currentBalance + balanceAdjustment,
                    lastUpdated: new Date().toISOString(),
                  }
                : env
            ),
          };
        });
      },

      // Delete a transaction and reverse its balance impact (Resilient Version)
      deleteTransaction: (transactionId: string) => {
        set((state) => {
          const transaction = state.transactions.find((tx) => tx.id === transactionId);

          if (!transaction) {
            console.warn('Transaction not found');
            return state;
          }

          const balanceReversal = transaction.type === 'Income' 
            ? -transaction.amount 
            : transaction.amount;

          const isTransfer = !!transaction.transferId;
          const transactionsToDelete = [transactionId];
          const envelopesToUpdate: string[] = [transaction.envelopeId];

          if (isTransfer) {
            const pairedTransaction = state.transactions.find(
              (tx) => tx.transferId === transaction.transferId && tx.id !== transactionId
            );
            
            if (pairedTransaction) {
              transactionsToDelete.push(pairedTransaction.id);
              envelopesToUpdate.push(pairedTransaction.envelopeId);
            }
          }

          const updatedEnvelopes = state.envelopes.map((env) => {
            if (env.id === transaction.envelopeId) {
              const newBalance = env.currentBalance + balanceReversal;
              return {
                ...env,
                currentBalance: newBalance,
                lastUpdated: new Date().toISOString(),
              };
            }

            if (isTransfer && envelopesToUpdate.includes(env.id) && env.id !== transaction.envelopeId) {
              const pairedTx = state.transactions.find(
                (tx) => tx.transferId === transaction.transferId && tx.id !== transactionId
              );
              if (pairedTx && pairedTx.envelopeId === env.id) {
                const pairedReversal = pairedTx.type === 'Income'
                  ? -pairedTx.amount
                  : pairedTx.amount;
                const newBalance = env.currentBalance + pairedReversal;
                return {
                  ...env,
                  currentBalance: newBalance,
                  lastUpdated: new Date().toISOString(),
                };
              }
            }

            return env;
          });

          return {
            transactions: state.transactions.filter(
              (tx) => !transactionsToDelete.includes(tx.id)
            ),
            envelopes: updatedEnvelopes,
          };
        });
      },

      // Restore a previously deleted transaction
      // NOTE: For Transfers, this only restores the single transaction record passed in.
      // It does not currently restore the paired transfer if it was deleted.
      restoreTransaction: (transaction: Transaction) => {
        set((state) => {
          const exists = state.transactions.some((tx) => tx.id === transaction.id);
          if (exists) return state;

          const balanceImpact = transaction.type === 'Income'
            ? transaction.amount
            : -transaction.amount;

          return {
            transactions: [...state.transactions, transaction],
            envelopes: state.envelopes.map((env) => {
              if (env.id === transaction.envelopeId) {
                return {
                  ...env,
                  currentBalance: env.currentBalance + balanceImpact,
                  lastUpdated: new Date().toISOString(),
                };
              }
              return env;
            }),
          };
        });
      },

      // --- TEMPLATE ACTIONS (ADDED) ---
      saveTemplate: (name: string, distributions: Record<string, number>, note: string = "") => {
        const cleanDistributions: Record<string, number> = {};
        Object.entries(distributions).forEach(([envId, amount]) => {
            if (amount > 0) cleanDistributions[envId] = amount;
        });

        const newTemplate: DistributionTemplate = {
          id: uuidv4(),
          name,
          distributions: cleanDistributions,
          lastUsed: new Date().toISOString(),
          note: note
        };

        set((state) => ({
          distributionTemplates: [...state.distributionTemplates, newTemplate]
        }));
      },

      deleteTemplate: (id: string) => {
        set((state) => ({
          distributionTemplates: state.distributionTemplates.filter(t => t.id !== id)
        }));
      },
    }),
    {
      name: 'envelope-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);