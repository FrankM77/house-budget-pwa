import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
  } from 'firebase/firestore';
  import { db } from '../firebase'; // Ensure you have your firebase config initialized here
  import type { Transaction } from '../types/schema';
  
  // The path to the collection: users/{userId}/transactions
  const getCollectionRef = (userId: string) => 
    collection(db, 'users', userId, 'transactions');
  
  export const TransactionService = {
    
    // 1. OBSERVE (Equivalent to Combine/@Published)
    // This function keeps the UI in sync with the Cloud automatically.
    subscribeToTransactions: (
      userId: string, 
      onUpdate: (transactions: Transaction[]) => void
    ) => {
      const q = query(getCollectionRef(userId), orderBy('date', 'desc'));
  
      // This listener stays alive and calls 'onUpdate' whenever DB changes
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const transactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Transaction[];
        
        onUpdate(transactions);
      });
  
      // Return the unsubscribe function so we can clean up (like .cancellable in Swift)
      return unsubscribe;
    },
  
    // 2. ADD (Create)
    addTransaction: async (userId: string, transaction: Omit<Transaction, 'id'>) => {
      // Firestore automatically generates the ID
      return await addDoc(getCollectionRef(userId), transaction);
    },
  
    // 3. UPDATE
    updateTransaction: async (userId: string, transactionId: string, updates: Partial<Transaction>) => {
      const docRef = doc(db, 'users', userId, 'transactions', transactionId);
      return await updateDoc(docRef, updates);
    },
  
    // 4. DELETE
    deleteTransaction: async (userId: string, transactionId: string) => {
      const docRef = doc(db, 'users', userId, 'transactions', transactionId);
      return await deleteDoc(docRef);
    }
  };