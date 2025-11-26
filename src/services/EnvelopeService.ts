import {
    collection,
    query,
    orderBy,
    onSnapshot,
    setDoc,
    updateDoc,
    doc
  } from 'firebase/firestore';
  import { db } from '../firebase'; // Ensure you have your firebase config initialized here
  import type { Envelope } from '../models/types';

  // The path to the collection: users/{userId}/envelopes
  const getCollectionRef = (userId: string) =>
    collection(db, 'users', userId, 'envelopes');

  export const EnvelopeService = {

    // 1. OBSERVE (Equivalent to Combine/@Published)
    // This function keeps the UI in sync with the Cloud automatically.
    subscribeToEnvelopes: (
      userId: string,
      onUpdate: (envelopes: Envelope[]) => void
    ) => {
      const q = query(getCollectionRef(userId), orderBy('orderIndex', 'asc'));

      // This listener stays alive and calls 'onUpdate' whenever DB changes
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const envelopes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Envelope[];

        onUpdate(envelopes);
      });

      // Return the unsubscribe function so we can clean up (like .cancellable in Swift)
      return unsubscribe;
    },

    // 2. SAVE (Create/Update with merge)
    saveEnvelope: async (userId: string, envelope: Envelope) => {
      const docRef = doc(db, 'users', userId, 'envelopes', envelope.id);
      return await setDoc(docRef, envelope, { merge: true });
    },

    // 3. UPDATE BALANCE
    updateBalance: async (userId: string, envelopeId: string, newBalance: number) => {
      const docRef = doc(db, 'users', userId, 'envelopes', envelopeId);
      return await updateDoc(docRef, {
        currentBalance: newBalance,
        lastUpdated: new Date().toISOString()
      });
    }
  };
