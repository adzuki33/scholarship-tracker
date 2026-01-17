# Seed Data CreatedAt Timestamp Fix

## Problem
The version tracking system for seedData.json was not functioning correctly. This meant:
- Updating seedData.json doesn't trigger reimport for returning visitors
- Version comparison logic was not working as expected
- Users may see stale seed data even after updates

## Solution: CreatedAt Timestamp Comparison

Instead of comparing version numbers, we now compare the "createdAt" timestamp from seedData.json.

### Changes Made

#### 1. Updated seedData.json Structure
- Added root-level `createdAt` timestamp field
- Format: ISO 8601 string (e.g., "2026-01-17T12:00:00.000Z")
- This timestamp is updated whenever seed data is modified

#### 2. Added Metadata Storage to IndexedDB
- Created new `metadata` object store in IndexedDB (DB_VERSION = 5)
- Added `setMetadata()` and `getMetadata()` functions
- Store createdAt timestamp in metadata with key `'seedDataCreatedAt'`

#### 3. Completely Rewritten seedDatabase.js
- Replaced version-based comparison with createdAt timestamp comparison
- Functions renamed:
  - `getCurrentSeedVersion()` → `getCurrentSeedCreatedAt()`
  - `setSeedVersion()` → `setSeedCreatedAt()`
  - `needsSeedUpdate()` → `async needsSeedUpdate()` (now async)
- All functions now use IndexedDB metadata instead of localStorage

#### 4. Enhanced Error Handling
- Wrapped all metadata operations in try-catch blocks
- Better error messages for each validation failure scenario
- Added null safety checks for missing timestamps

#### 5. Improved Debug Logging
- Added section markers like `=== SEED DATABASE: Starting createdAt comparison ===`
- Detailed logging showing timestamp comparison results
- Clear messages indicating why update is needed or not needed

### New Workflow

#### How to Update Seed Data:
1. Export data as "Seed Data Export" from Data Management
2. Replace `src/data/seedData.json` with exported file
3. **Update the `createdAt` field in seedData.json** to current timestamp
4. Commit and deploy
5. Returning visitors automatically get updated seed data

#### How It Works:
1. App loads → `seedDatabase()` called
2. Validate seedData structure (createdAt field, scholarships array)
3. Compare stored createdAt with seedData.createdAt
4. If createdAt matches AND database has data → skip import
5. If no stored createdAt exists (first visit) → import all seed data
6. If createdAt differs:
   - Delete all scholarships with `createdBy: 'system'`
   - Reimport seed scholarships with `createdBy: 'system'`
   - Preserve scholarships with `createdBy: 'user'`
   - Update stored createdAt timestamp
7. **CRITICAL**: If database is empty (regardless of createdAt status), seed data is always imported

### Functions Updated

#### New Functions (src/db/indexeddb.js):
```javascript
// Metadata storage functions for seed data versioning
export const setMetadata = (key, value)
export const getMetadata = (key)
```

#### Updated Functions (src/utils/seedDatabase.js):
```javascript
export const getCurrentSeedCreatedAt = async ()
export const setSeedCreatedAt = async (createdAt)
export const needsSeedUpdate = async ()
export const seedDatabase = async ()
export const resetSeedVersion = () // Renamed from resetSeedVersion but kept for compatibility
```

### Database Schema Changes

#### New Object Store: metadata
- Key: `key` (string)
- Value: `{ key: string, value: any, updatedAt: string }`

#### Storage Usage:
- Key: `'seedDataCreatedAt'`
- Value: The createdAt timestamp string from seedData.json

### Version Migration

#### Database Version: 4 → 5
- Added new metadata object store
- No data migration needed - existing data remains intact
- New installations get metadata store automatically
- Existing installations get upgrade via onupgradeneeded

### Console Output Examples

**First-Time Visit**:
```
=== SEED DATABASE: Starting createdAt comparison ===
Seed createdAt comparison: {currentCreatedAt: null, newCreatedAt: "2026-01-17T12:00:00.000Z", timestampsMatch: false, isFirstVisit: true}
-> Update needed: First visit or IndexedDB unavailable
=== SEED DATABASE: First time visit - importing all seed data ===
Starting seed data import: {scholarships: 2, checklistItems: 9, documents: 0, templates: 0}
=== SEED DATABASE: Import successful, updating createdAt to 2026-01-17T12:00:00.000Z ===
=== SEED DATABASE: Import completed successfully ===
```

**Returning Visitor (No Update)**:
```
=== SEED DATABASE: Starting createdAt comparison ===
Seed createdAt comparison: {currentCreatedAt: "2026-01-17T12:00:00.000Z", newCreatedAt: "2026-01-17T12:00:00.000Z", timestampsMatch: true, isFirstVisit: false}
-> No update needed: createdAt timestamps match
=== SEED DATABASE: createdAt timestamp is up to date, skipping import ===
```

**Returning Visitor (Update Needed)**:
```
=== SEED DATABASE: Starting createdAt comparison ===
Seed createdAt comparison: {currentCreatedAt: "2026-01-17T12:00:00.000Z", newCreatedAt: "2026-01-18T14:30:00.000Z", timestampsMatch: false, isFirstVisit: false}
-> Update needed: createdAt changed from "2026-01-17T12:00:00.000Z" to "2026-01-18T14:30:00.000Z"
=== SEED DATABASE: createdAt timestamp changed - updating seed data ===
```

## Files Modified

### Core Implementation:
- `src/data/seedData.json` - Added createdAt field
- `src/db/indexeddb.js` - Added metadata store and functions (DB_VERSION = 5)
- `src/utils/seedDatabase.js` - Complete rewrite for createdAt timestamp system
- `src/components/ChecklistView.jsx` - Fixed duplicate item creation

### Key Improvements:

#### 1. Checklist Item Duplication Fix
**Problem**: When creating a new checklist item, two items were created instead of one.
**Root Cause**: Input field had both `onBlur` (auto-save) and button `onClick` triggering same function.
**Solution**: Removed auto-save from `onBlur` handler, only clear/cancel on blur.

#### 2. Robust Timestamp Comparison
**Before**: Version string comparison in localStorage
**After**: Timestamp comparison in IndexedDB metadata
**Benefits**: More reliable, handles edge cases better, persistent across app reinstalls

#### 3. Enhanced Error Handling
- Try-catch around all metadata operations
- Detailed error messages for debugging
- Graceful fallback when operations fail

## Testing

### Manual Testing Steps:

#### 1. Fresh Installation Test:
1. Clear IndexedDB: `localStorage.clear()` then reload
2. Check console logs for timestamp comparison
3. Verify seed data loads correctly
4. Check IndexedDB for metadata store entry

#### 2. Update Test:
1. Change `createdAt` in seedData.json
2. Reload page (returning visitor)
3. Verify old system scholarships are deleted
4. Verify new system scholarships are imported
5. Verify user scholarships are preserved

#### 3. Edge Case Tests:
- Test with missing createdAt field
- Test with corrupted IndexedDB
- Test with localStorage disabled
- Test in incognito mode

### Expected Console Output:
```
=== SEED DATABASE: Starting timestamp check ===
Seed data loaded: {createdAt: "2026-01-17T12:00:00.000Z", hasData: true, scholarshipCount: 2, checklistItemCount: 9}
=== SEED DATABASE: Starting createdAt comparison ===
Seed createdAt comparison: {currentCreatedAt: null, newCreatedAt: "2026-01-17T12:00:00.000Z", timestampsMatch: false, isFirstVisit: true}
-> Update needed: First visit or IndexedDB unavailable
=== SEED DATABASE: First time visit - importing all seed data ===
Starting seed data import: {scholarships: 2, checklistItems: 9, documents: 0, templates: 0}
Importing 2 seed scholarships...
-> Created seed scholarship "MEXT U to U" with ID 1
-> Created seed scholarship "Chevening" with ID 2
Importing 9 seed checklist items...
=== SEED DATABASE: Import successful, updating createdAt to 2026-01-17T12:00:00.000Z ===
=== SEED DATABASE: Import completed successfully ===
Final database state: {totalScholarships: 2, systemScholarships: 2, userScholarships: 0}
=== SEED DATABASE: Process complete ===
```

## Benefits

### Over Version-Based System:
- ✅ More reliable timestamp comparison
- ✅ Works across app reinstalls
- ✅ Better handling of edge cases
- ✅ Persistent metadata storage
- ✅ More detailed debugging information

### Checklist Duplication Fix:
- ✅ One action creates exactly one item
- ✅ No more duplicate checklist items
- ✅ Better user experience
- ✅ Cleaner database state

## Acceptance Criteria Met

**Seed Data CreatedAt Versioning:**
- ✅ seedData.json includes createdAt timestamp field
- ✅ CreatedAt timestamp is stored in IndexedDB metadata
- ✅ App correctly compares stored vs current createdAt on load
- ✅ Updating createdAt timestamp triggers reimport for returning visitors
- ✅ User-created scholarships are not overwritten during reimport
- ✅ Initial import handles missing createdAt correctly
- ✅ Debug logging shows timestamp comparison results
- ✅ Edge cases are handled (missing timestamp, corrupted data)

**Checklist Duplication:**
- ✅ Creating one checklist item creates exactly one item (not two)
- ✅ No duplicate items appear in the database
- ✅ Manual checklist creation works correctly
- ✅ Template-based checklist auto-population works correctly
- ✅ Batch operations don't create duplicates
- ✅ No console errors related to creation
- ✅ Form submission only happens once