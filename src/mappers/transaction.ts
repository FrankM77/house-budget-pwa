import { Timestamp } from 'firebase/firestore';
import type { Transaction } from '../models/types';
import type { FirestoreTransaction, FirestoreTransactionType } from '../types/firestore';

const toTitleCaseType = (type: FirestoreTransactionType | string): Transaction['type'] => {
  if (type === 'income') return 'Income';
  if (type === 'expense') return 'Expense';
  if (type === 'transfer') return 'Transfer';
  return type as Transaction['type'];
};

const toLowerCaseType = (type: Transaction['type'] | string): FirestoreTransactionType => {
  const lower = type.toLowerCase();
  if (lower === 'income' || lower === 'expense' || lower === 'transfer') return lower;
  return 'expense';
};

export const transactionFromFirestore = (firebaseTx: FirestoreTransaction): Transaction => ({
  id: firebaseTx.id,
  date: firebaseTx.date?.toDate?.() ? firebaseTx.date.toDate().toISOString() : (firebaseTx.date as unknown as string),
  amount: typeof firebaseTx.amount === 'string' ? parseFloat(firebaseTx.amount) || 0 : (firebaseTx.amount as unknown as number),
  description: firebaseTx.description || '',
  envelopeId: firebaseTx.envelopeId || '',
  reconciled: firebaseTx.reconciled ?? false,
  type: toTitleCaseType(firebaseTx.type),
  transferId: firebaseTx.transferId ?? undefined,
  userId: firebaseTx.userId,
});

export const transactionToFirestore = (
  tx: Transaction,
  userId: string
): FirestoreTransaction => ({
  id: tx.id,
  userId,
  envelopeId: tx.envelopeId,
  amount: tx.amount.toString(),
  date: Timestamp.fromDate(new Date(tx.date)),
  description: tx.description,
  reconciled: tx.reconciled ?? false,
  type: toLowerCaseType(tx.type),
  transferId: tx.transferId ?? null,
});

export const transactionUpdatesToFirestore = (tx: Transaction): Omit<FirestoreTransaction, 'id' | 'userId'> => ({
  envelopeId: tx.envelopeId,
  amount: tx.amount.toString(),
  date: Timestamp.fromDate(new Date(tx.date)),
  description: tx.description,
  reconciled: tx.reconciled ?? false,
  type: toLowerCaseType(tx.type),
  transferId: tx.transferId ?? null,
});
