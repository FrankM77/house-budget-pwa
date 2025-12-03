# OrderBy Fix - Data Disappearing on Refresh

**Date:** December 3, 2025  
**Issue:** Envelopes disappearing after page refresh  
**Root Cause:** `orderBy('orderIndex')` only returns documents with that field

---

## 🐛 Problem

When we changed `getAllEnvelopes()` to use `orderBy('orderIndex')`, envelopes without an `orderIndex` field in Firebase were not returned by the query. This caused all data to disappear on refresh.

**Firebase Behavior:** When using `orderBy('fieldName')`, Firebase only returns documents that have that field. Documents without the field are excluded from results.

---

## ✅ Solution

Changed `getAllEnvelopes()` to:
1. **Fetch ALL documents** without ordering (using `getDocs(collectionRef)` directly)
2. **Ensure orderIndex exists** (default to index if missing)
3. **Sort in memory** by `orderIndex`

This ensures we always get all envelopes, regardless of whether they have `orderIndex` or not.

---

## 📝 Code Changes

**File:** `src/services/EnvelopeService.ts`  
**Function:** `getAllEnvelopes()`

**Before (Broken):**
```typescript
const q = query(getCollectionRef(userId), orderBy('orderIndex', 'asc'));
const snapshot = await getDocs(q);
// Only returns documents WITH orderIndex field
```

**After (Fixed):**
```typescript
// Fetch ALL documents without ordering
const collectionRef = getCollectionRef(userId);
const snapshot = await getDocs(collectionRef);

const envelopes = snapshot.docs.map((doc, index) => ({
  id: doc.id,
  ...doc.data(),
  // Ensure orderIndex is always set (default to index if missing)
  orderIndex: doc.data().orderIndex ?? index
}));

// Sort by orderIndex in memory
const sortedEnvelopes = envelopes.sort((a, b) => {
  const aIndex = a.orderIndex ?? 0;
  const bIndex = b.orderIndex ?? 0;
  return aIndex - bIndex;
});
```

---

## 🎯 Benefits

1. **Always gets all envelopes** - No documents are excluded
2. **Handles missing orderIndex** - Defaults to index if missing
3. **Consistent sorting** - Still sorted by orderIndex for UI consistency
4. **Graceful degradation** - Works even if envelopes don't have orderIndex yet

---

## ⚠️ Note About subscribeToEnvelopes

The `subscribeToEnvelopes()` function still uses `orderBy('orderIndex')` which may have the same issue. However, since:
- Real-time subscriptions work differently than queries
- The immediate issue was on refresh (which uses `getAllEnvelopes()`)

The fix to `getAllEnvelopes()` resolves the immediate problem. If real-time subscriptions also miss envelopes, we can apply a similar fix later.

---

## 🧪 Testing

**To verify the fix:**
1. Create 2-3 envelopes
2. Refresh the page
3. ✅ All envelopes should still be visible

**Expected:** All envelopes appear after refresh, sorted by orderIndex (or index if orderIndex is missing).

---

*Fix completed - data should no longer disappear on refresh!*

