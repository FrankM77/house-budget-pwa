# Envelope Store Refactor Progress

_Last updated: 2025-12-17_

## Goal
Incrementally break the monolithic `src/stores/envelopeStore.ts` Zustand store into focused slices without changing the public API or runtime behavior. Each extraction keeps the store compiling and verified via `npm run build`.

## Completed Extractions
1. **Network helpers** – `src/stores/envelopeStoreNetwork.ts`
   - Centralizes online/offline detection (`checkOnlineStatus`) and `isNetworkError` logic for reuse.
2. **Realtime subscriptions** – `src/stores/envelopeStoreRealtime.ts`
   - Houses Firebase listeners (envelopes, transactions, templates, settings) and subscription cleanup.
3. **Transaction actions** – `src/stores/envelopeStoreTransactions.ts`
   - `addTransaction`, `deleteTransaction`, `updateTransaction`, `restoreTransaction` with optimistic UI + Firebase sync.
4. **Envelope actions** – `src/stores/envelopeStoreEnvelopes.ts`
   - `createEnvelope`, `addToEnvelope`, `spendFromEnvelope`, `transferFunds`, `deleteEnvelope`; preserves Timestamp + string conversions.
5. **Template actions & cleanup utilities** – `src/stores/envelopeStoreTemplates.ts`
   - `saveTemplate`, `deleteTemplate`, `cleanupOrphanedTemplates`, `updateTemplateEnvelopeReferences`, `removeEnvelopeFromTemplates` with offline fallbacks.

`envelopeStore.ts` now hosts the original logic while we experiment with slice delegation in a separate branch of work. Delegate attempts were rolled back after TypeScript issues; extraction still lives in the slice files for later integration.

## Verification
- `npm run build` → ✅ (TypeScript + Vite) after each set of changes.
- Restored `handleUserLogout` in the store interface to satisfy `UserMenu` consumer.

## Remaining Work
1. **Settings slice delegation**
   - Wire `updateAppSettings` / `initializeAppSettings` from `envelopeStoreSettings.ts` back into the root store.
2. **Template cleanup delegation**
   - Reconnect `cleanupOrphanedTemplates`, `updateTemplateEnvelopeReferences`, `removeEnvelopeFromTemplates` to the slice factory.
3. **Envelope + transaction delegation**
   - Reintroduce delegation to `envelopeStoreEnvelopes.ts` and `envelopeStoreTransactions.ts`, ensuring helper factories are instantiated once and reused.
4. **Sync slice integration**
   - After delegations compile cleanly, reattempt `createSyncSlice` wiring and migrate shared converters/helpers into a common utility.
5. **Verification**
   - `npm run build` and basic smoke tests (login, envelope CRUD, template operations, offline toggles).

## Notes from 2025-12-17 Session
- Multiple attempts to instantiate slices directly inside `useEnvelopeStore` introduced scope/type recursion (due to slice factories calling `get()` methods they redefine). Need to create factories once outside the returned object and reuse their bindings.
- To avoid breaking the working store, reverted `envelopeStore.ts` to pre-delegation state while keeping slice files intact.
- Next session: start by instantiating `const transactionSlice = createTransactionSlice({...})` immediately before the `return {}` and spread its members into the object literal (`...transactionSlice`). Repeat for other slices to minimize boilerplate and reduce lint noise.


## Notes & Decisions
- No behavioral changes introduced; all network/service calls remain untouched.
- Offline-first logic preserved with `pendingSync` flags and Firebase fallbacks.
- Template slice retains timeout-based offline detection to avoid silent failures.

## Next Steps
1. Implement settings slice and re-run build.
2. Extract sync/reset/import logic, ensuring state flags (`pendingSync`, `resetPending`) behave identically.
3. Compile final regression checklist + smoke results in this document.
