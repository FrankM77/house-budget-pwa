# How to Check orderIndex Values

**Date:** December 3, 2025

---

## 🔍 Method 1: Firebase Console (Recommended)

1. **Open Firebase Console:**
   - Go to: https://console.firebase.google.com/
   - Select your project
   - Go to: Firestore Database

2. **Navigate to envelopes:**
   - Path: `users/test-user-123/envelopes`
   - Click on each envelope document

3. **Check orderIndex field:**
   - Look for the `orderIndex` field in each document
   - It should be a number (0, 1, 2, etc.)
   - If missing, it defaults to the document index when fetched

---

## 🔍 Method 2: Browser Console

1. **Open Developer Tools:**
   - Press F12 or right-click → Inspect
   - Go to Console tab

2. **Check store state:**
```javascript
// Get current envelopes with orderIndex
const envelopes = window.useEnvelopeStore?.getState().envelopes;
console.log('Envelopes:', envelopes.map(e => ({
  name: e.name,
  orderIndex: e.orderIndex,
  id: e.id
})));
```

3. **Check during fetch:**
   - Refresh the page
   - Look for console logs like: `📡 EnvelopeService.getAllEnvelopes called for user:`
   - The envelopes should be sorted by orderIndex

---

## 🔍 Method 3: Check After Creating New Envelope

1. **Create a new envelope**
2. **Check the console log:**
   - Look for: `📄 Envelope addDoc succeeded`
   - The envelope should have `orderIndex` set when created

3. **Check Firebase:**
   - The new envelope should have `orderIndex: 0` (or next available number)

---

## 📊 What orderIndex Should Look Like

**Good Examples:**
```javascript
[
  { name: "Groceries", orderIndex: 0, id: "..." },
  { name: "Gas", orderIndex: 1, id: "..." },
  { name: "Entertainment", orderIndex: 2, id: "..." }
]
```

**If Missing (auto-assigned):**
```javascript
[
  { name: "Groceries", orderIndex: 0, id: "..." }, // Had orderIndex
  { name: "Gas", orderIndex: 1, id: "..." },       // Auto-assigned
  { name: "Entertainment", orderIndex: 2, id: "..." } // Auto-assigned
]
```

---

## 🎯 Key Points

- **orderIndex** determines envelope order (ascending: 0, 1, 2, ...)
- **Lower numbers** appear first
- **If missing**, gets auto-assigned when fetched
- **All envelopes** should have this field for consistent ordering

---

## 🐛 If orderIndex is Wrong

**Check Firebase Console:**
- Verify envelopes have `orderIndex` field
- Values should be consecutive integers: 0, 1, 2, etc.

**Check Console Logs:**
- Look for: `✅ Fetched envelopes: X`
- The sorting should happen after this log

---

*Happy debugging! Let me know what you find.*

