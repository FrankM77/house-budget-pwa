# Testing Guide: Reset Data Fix

**Date:** December 3, 2025  
**Fix:** Offline-first resetData implementation

---

## 🧪 Test Scenarios

### Prerequisites
- App running in development mode
- Firebase console open (to verify data deletion)
- Browser DevTools open (Console tab)
- Network tab open (to simulate offline/online)

---

## Test 1: Online Reset ✅

**Goal:** Verify reset works when online and Firebase is cleared immediately

### Steps:
1. **Set up test data:**
   - Create 2-3 envelopes with some transactions
   - Create 1-2 distribution templates
   - Verify data appears in Firebase console (users/test-user-123/)

2. **Perform reset (online):**
   - Open browser DevTools → Console tab
   - Make sure you're online (check network status)
   - Navigate to Settings page
   - Click "Reset All Data" button
   - Confirm the reset

3. **Expected Results:**
   - ✅ Local state clears immediately (UI shows empty)
   - ✅ Console shows: "✅ Local state cleared immediately"
   - ✅ Console shows: "🌐 Online - performing Firebase reset immediately..."
   - ✅ Console shows: "📡 Querying Firebase for all data to delete..."
   - ✅ Console shows: "✅ Firebase reset complete: Deleted X envelopes, Y transactions..."
   - ✅ Firebase console shows empty collections (refresh Firebase console)

### Verify in Firebase Console:
- Go to Firebase Console → Firestore Database
- Navigate to: `users/test-user-123/envelopes` → Should be empty
- Navigate to: `users/test-user-123/transactions` → Should be empty
- Navigate to: `users/test-user-123/distributionTemplates` → Should be empty
- Navigate to: `users/test-user-123/appSettings` → Should be empty

---

## Test 2: Offline Reset → Online Sync 🔄

**Goal:** Verify offline reset persists and Firebase clears when back online

### Steps:
1. **Set up test data again:**
   - Create 2-3 envelopes with transactions
   - Create 1-2 templates
   - Verify data in Firebase console

2. **Go offline:**
   - Open DevTools → Network tab
   - Enable "Offline" mode (throttle dropdown → Offline)
   - OR: Disable WiFi/network connection
   - Verify app shows offline status

3. **Perform reset (offline):**
   - Navigate to Settings page
   - Click "Reset All Data"
   - Confirm reset

4. **Expected Results (Offline):**
   - ✅ Local state clears immediately (UI shows empty)
   - ✅ Console shows: "✅ Local state cleared immediately"
   - ✅ Console shows: "📴 Offline - Firebase reset will be performed when connection is restored"
   - ✅ Firebase console still shows data (hasn't been deleted yet)

5. **Go back online:**
   - Re-enable network (disable "Offline" in DevTools or reconnect WiFi)
   - Wait for "online" event (should see console log)

6. **Expected Results (Online):**
   - ✅ Console shows: "🔄 Auto-syncing pending operations..."
   - ✅ Console shows: "🔄 Sync detected pending reset - performing Firebase reset..."
   - ✅ Console shows: "📡 Querying Firebase for all data to delete..."
   - ✅ Console shows: "✅ Firebase reset complete..."
   - ✅ Firebase console shows empty collections (refresh to verify)

---

## Test 3: Cross-Device Data Deletion 🌐

**Goal:** Verify reset deletes data from Firebase even if not in local state

### Steps:
1. **Create data on "Device A":**
   - Create 2 envelopes with transactions
   - Create 1 template
   - Verify in Firebase console

2. **On "Device B" (or same device, different session):**
   - Open app (don't sync/fetch data yet)
   - Local state should be empty or minimal
   - Navigate to Settings
   - Click "Reset All Data" (while online)

3. **Expected Results:**
   - ✅ Local state clears (already empty/minimal)
   - ✅ Console shows: "📡 Querying Firebase for all data to delete..."
   - ✅ Console shows ALL items found and deleted (even though not in local state)
   - ✅ Firebase console shows empty collections

### Alternative Test (Same Device):
1. Create data in Firebase directly (or from another device)
2. Don't refresh/fetch in current app session
3. Perform reset
4. Verify Firebase data is deleted even though it wasn't in local state

---

## Test 4: Reset with Unsynced Local Data 📱

**Goal:** Verify reset clears local temp data and pending syncs

### Steps:
1. **Create data offline:**
   - Go offline
   - Create 2 envelopes (these get temp IDs like "temp-...")
   - Create some transactions
   - Local state has data with temp IDs

2. **Reset while still offline:**
   - Click "Reset All Data"
   - Confirm

3. **Expected Results:**
   - ✅ All local data cleared (including temp IDs)
   - ✅ Console shows: "📴 Offline - Firebase reset will be performed when connection is restored"
   - ✅ resetPending flag is set

4. **Go online:**
   - Reconnect
   - Wait for sync

5. **Expected Results:**
   - ✅ No data gets synced (temp IDs were cleared)
   - ✅ Firebase reset completes
   - ✅ Firebase console is empty

---

## Test 5: Multiple Quick Resets ⚡

**Goal:** Verify no race conditions with rapid resets

### Steps:
1. Create some test data
2. Click "Reset All Data" quickly 2-3 times in succession
3. Wait for completion

### Expected Results:
- ✅ No errors or crashes
- ✅ All data eventually cleared
- ✅ No duplicate operations
- ✅ Console shows clean execution

---

## Test 6: Reset Failure Recovery 🔄

**Goal:** Verify reset retries if Firebase deletion fails

### Steps:
1. Create test data
2. Go partially offline (unstable connection)
3. Click "Reset All Data"
4. Some deletions may fail

### Expected Results:
- ✅ Local state still clears
- ✅ resetPending flag remains true
- ✅ On next sync, reset retries
- ✅ Eventually all data is cleared

---

## 🔍 Console Logs to Watch For

### Successful Online Reset:
```
🗑️ Starting complete data reset (offline-first)...
✅ Local state cleared immediately
🌐 Online - performing Firebase reset immediately...
🗑️ performFirebaseReset: Starting complete Firebase reset...
📡 Querying Firebase for all data to delete...
📊 Found in Firebase: X envelopes, Y transactions, Z templates
✅ Deleted envelope: [name]
✅ Deleted transaction: [id]
✅ Firebase reset complete: Deleted X envelopes, Y transactions, Z templates
```

### Successful Offline Reset:
```
🗑️ Starting complete data reset (offline-first)...
✅ Local state cleared immediately
📴 Offline - Firebase reset will be performed when connection is restored
```

### Coming Back Online (after offline reset):
```
🔄 Auto-syncing pending operations...
🔄 Sync detected pending reset - performing Firebase reset...
🗑️ performFirebaseReset: Starting complete Firebase reset...
📡 Querying Firebase for all data to delete...
✅ Firebase reset complete...
```

---

## ✅ Success Criteria Checklist

- [ ] **Test 1:** Online reset clears Firebase immediately
- [ ] **Test 2:** Offline reset persists and clears Firebase when back online
- [ ] **Test 3:** Reset deletes data not in local state (cross-device)
- [ ] **Test 4:** Reset clears unsynced local data correctly
- [ ] **Test 5:** Multiple rapid resets don't cause errors
- [ ] **Test 6:** Reset retries on failure

### Key Verification Points:
- [ ] Local state clears immediately (always)
- [ ] Firebase data is eventually deleted (even if offline first)
- [ ] No data reappears after reset
- [ ] Console logs show correct flow
- [ ] Firebase console shows empty collections

---

## 🐛 Debugging Tips

### If Reset Doesn't Work:
1. Check browser console for errors
2. Check Firebase console for data state
3. Verify network connectivity
4. Check `resetPending` flag in store (add temporary console.log)
5. Verify `isOnline` status

### Check Store State:
Open browser console and run:
```javascript
// Check current store state
const state = window.useEnvelopeStore?.getState();
console.log('Reset Pending:', state?.resetPending);
console.log('Pending Sync:', state?.pendingSync);
console.log('Is Online:', state?.isOnline);
console.log('Envelopes:', state?.envelopes.length);
console.log('Transactions:', state?.transactions.length);
```

### Check Firebase Directly:
1. Open Firebase Console
2. Navigate to Firestore Database
3. Check path: `users/test-user-123/`
4. Verify collections are empty after reset

---

## 📝 Test Results Template

**Test Date:** ___________

| Test # | Scenario | Status | Notes |
|--------|----------|--------|-------|
| 1 | Online Reset | ⬜ Pass / ⬜ Fail | |
| 2 | Offline → Online Reset | ⬜ Pass / ⬜ Fail | |
| 3 | Cross-Device Reset | ⬜ Pass / ⬜ Fail | |
| 4 | Unsynced Data Reset | ⬜ Pass / ⬜ Fail | |
| 5 | Multiple Resets | ⬜ Pass / ⬜ Fail | |
| 6 | Failure Recovery | ⬜ Pass / ⬜ Fail | |

**Overall Status:** ⬜ All Tests Pass / ⬜ Issues Found

**Issues Found:**
- 


---

*Happy Testing! 🎉*

