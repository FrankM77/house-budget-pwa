import type { Timestamp } from 'firebase/firestore';

export type FirestoreTransactionType = 'income' | 'expense' | 'transfer';

export interface FirestoreAppSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
}

export interface FirestoreTransaction {
  id: string;
  envelopeId: string;
  amount: string;
  date: Timestamp;
  description: string;
  reconciled: boolean;
  type: FirestoreTransactionType;
  transferId?: string | null;
  userId?: string;
}

export interface FirestoreDistributionTemplate {
  id: string;
  name: string;
  distributions: Record<string, string>;
  lastUsed: Timestamp;
  note: string;
  userId?: string;
}
