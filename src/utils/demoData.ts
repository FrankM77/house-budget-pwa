import type { IncomeSource, EnvelopeAllocation } from '../models/types';

export const mockMonthlyBudgetData = {
  // Sample data for current month (2025-01)
  currentMonth: '2025-01' as string,

  incomeSources: [
    {
      id: 'income-1',
      userId: 'demo-user',
      month: '2025-01',
      name: 'Primary Job',
      amount: 4000,
      frequency: 'monthly' as const,
      category: 'salary',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'income-2',
      userId: 'demo-user',
      month: '2025-01',
      name: 'Freelance',
      amount: 800,
      frequency: 'monthly' as const,
      category: 'side-hustle',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] satisfies IncomeSource[],

  envelopeAllocations: [
    {
      id: 'alloc-1',
      userId: 'demo-user',
      envelopeId: 'env-groceries',
      month: '2025-01',
      budgetedAmount: 600,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'alloc-2',
      userId: 'demo-user',
      envelopeId: 'env-gas',
      month: '2025-01',
      budgetedAmount: 200,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'alloc-3',
      userId: 'demo-user',
      envelopeId: 'env-utilities',
      month: '2025-01',
      budgetedAmount: 300,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] satisfies EnvelopeAllocation[],
};

export const mockEnvelopeNames: Record<string, string> = {
  'env-groceries': 'Groceries',
  'env-gas': 'Gas',
  'env-utilities': 'Utilities',
  'env-entertainment': 'Entertainment',
  'env-savings': 'Emergency Savings',
  'env-dining': 'Dining Out',
  'env-clothing': 'Clothing',
  'env-insurance': 'Insurance',
  'env-subscriptions': 'Subscriptions',
  'env-gifts': 'Gifts',
};
