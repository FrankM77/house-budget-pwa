# Check Template Data Types

## 🔍 Firebase Console Check

Go to Firebase Console → Firestore Database → `users/test-user-123/distributionTemplates`

Look at your template document and check the `distributions` field:

### What You Might See:
```json
{
  "name": "My Template",
  "note": "Test note",
  "lastUsed": "2025-12-03T...",
  "distributions": {
    "envelopeId1": 50,      // ← Numbers? Or...
    "envelopeId2": "25"     // ← Strings?
  }
}
```

### The Problem:
- **Store expects**: `Record<string, number>` (numbers)
- **Firebase might have**: `Record<string, string>` (strings)
- **JavaScript is lenient**: `50 + "25"` = `"5025"` (string concatenation!)
- **But math operations fail**: `Object.values(distributions).reduce((sum, val) => sum + val, 0)`

## 🧪 Test for Type Issues

### 1. Load a Template
- Open Distribute Funds modal
- Load your template
- Check if the amounts populate correctly

### 2. Check Console for Errors
- Look for errors like: `"NaN"` or math operation failures
- Check if template loading works but amounts are wrong

### 3. Check Network Tab
- When saving template: Are amounts sent as numbers?
- When loading template: Are amounts received as strings?

## 🎯 The Real Issue

Even if it "works", the type mismatch means:
- ❌ **Type Safety**: TypeScript can't catch bugs
- ❌ **Runtime Errors**: Math operations might fail silently
- ❌ **Data Corruption**: Firebase might store wrong formats
- ❌ **Cross-Device Sync**: Different devices might interpret data differently

## 🛠️ Fix Needed

We need conversion functions:
- Store format ↔ Firebase format
- `number` ↔ `string` for amounts
- `string` ↔ `Timestamp` for dates

This ensures consistent data handling across the entire app.

---

**Check your Firebase template data and let me know what types you see!**

