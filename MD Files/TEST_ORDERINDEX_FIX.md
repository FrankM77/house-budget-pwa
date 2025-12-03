# Testing orderIndex Fix

**Date:** December 3, 2025
**Goal:** Verify envelopes save orderIndex to Firebase

---

## 🧪 Test Steps

### Test 1: Create New Envelope
1. **Open the app**
2. **Go to envelope list**
3. **Tap "+" to add envelope**
4. **Create envelope:** Name: "Test OrderIndex", Balance: 100
5. **Save**

### Check Firebase Console
1. **Go to Firebase Console → Firestore Database**
2. **Navigate:** `users/test-user-123/envelopes`
3. **Find the "Test OrderIndex" envelope**
4. **Click on it to see fields**

### Expected Results:
- ✅ **orderIndex field exists** (should be a number like 1, 2, etc.)
- ✅ **Console logs** show orderIndex being saved

---

### Test 2: Check Migration
1. **Refresh the page**
2. **Open browser console**
3. **Look for migration logs:**
   ```
   🔄 Migrating X envelopes to add orderIndex...
   ✅ Migrated envelope [name] with orderIndex [number]
   ```

### Expected Results:
- ✅ **Migration runs** for existing envelopes without orderIndex
- ✅ **All envelopes** get orderIndex field in Firebase

---

### Test 3: Verify Ordering
1. **Create 2-3 more envelopes**
2. **Check order in app** (should be consistent)
3. **Refresh page**
4. **Verify order stays the same**

### Expected Results:
- ✅ **Order persists** after refresh
- ✅ **New envelopes** appear at end
- ✅ **Firebase shows** sequential orderIndex values

---

## 🔍 What to Look For

### Firebase Console:
```
envelope document:
├── name: "Test OrderIndex"
├── currentBalance: 100
├── orderIndex: 1  ← This should exist!
├── lastUpdated: "2025-12-03T..."
└── other fields...
```

### Console Logs:
```
📝 EnvelopeService.createEnvelope: Adding envelope for user test-user-123
🔄 Migrating X envelopes to add orderIndex...
✅ Migrated envelope [name] with orderIndex [number]
```

---

## ✅ Success Criteria

- [ ] New envelopes have `orderIndex` field in Firebase
- [ ] Migration runs and updates existing envelopes
- [ ] All envelopes have sequential orderIndex values
- [ ] App ordering remains consistent

---

## 🐛 If It Doesn't Work

### Check Console for Errors:
- Look for Firebase save errors
- Check if `orderIndex` is being calculated correctly

### Check Browser Console:
```javascript
// Check current envelopes
const envelopes = window.useEnvelopeStore?.getState().envelopes;
console.log('Envelopes:', envelopes.map(e => ({
  name: e.name,
  orderIndex: e.orderIndex
})));
```

---

## 📝 Quick Debug

If orderIndex is missing:
1. **Check AddEnvelopeView** - is it passing orderIndex?
2. **Check envelopeStore.createEnvelope** - is it including orderIndex in Firebase save?
3. **Check Firebase Console** - refresh to see if field was added after migration

---

*Test the orderIndex fix and let me know the results!*

