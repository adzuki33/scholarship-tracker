# Testing Seed Data Versioning

## Issue
Seed data versioning system needed enhanced error handling and better diagnostics to ensure it works correctly across all scenarios.

## Fixes Applied
1. **Enhanced validation**: Separate checks for missing seedData, version field, scholarships array
2. **Better error handling**: Try-catch blocks for localStorage operations
3. **Improved logging**: Detailed console logs at each step with section markers
4. **Robust version comparison**: Clear checks and logging for all version scenarios

## Manual Testing Steps

### Test 1: First Visit (Fresh Browser)
1. **Clear all data**: Open browser DevTools → Application → Storage → "Clear site data"
2. Or run: `localStorage.clear()`, then delete IndexedDB database
3. Refresh the page
4. **Expected behavior**:
   - Console shows: `=== SEED DATABASE: Starting version check ===`
   - Console shows: `isFirstVisit: true`
   - Console shows: `-> Update needed: First visit or localStorage unavailable`
   - Console shows: `=== SEED DATABASE: First time visit - importing all seed data ===`
   - Seed scholarships appear in app
   - Console shows: `=== SEED DATABASE: Import completed ===`
   - Console shows: `Storing seed version to localStorage: 1.0`
5. **Verify**:
   - Check DevTools → Application → Local Storage → `scholarship-tracker-seed-version` = "1.0"
   - Check IndexedDB → scholarships → seed scholarships have `createdBy: 'system'`

### Test 2: Returning Visitor (Version Unchanged)
1. After Test 1, refresh the page
2. **Expected behavior**:
   - Console shows: `=== SEED DATABASE: Starting version check ===`
   - Console shows: `isFirstVisit: false`
   - Console shows: `versionMatch: true`
   - Console shows: `-> No update needed: Versions match`
   - Console shows: `=== SEED DATABASE: Version is up to date, skipping import ===`
   - No new imports
   - No existing data is changed
3. **Verify**:
   - IndexedDB count is unchanged
   - No duplicate scholarships
   - Version in localStorage is still "1.0"

### Test 3: Version Update (Simulated)
1. Open browser DevTools → Console
2. Run: `localStorage.setItem('scholarship-tracker-seed-version', '0.9')`
3. Refresh the page
4. **Expected behavior**:
   - Console shows: `currentVersion: "0.9"`, `newVersion: "1.0"`
   - Console shows: `versionMatch: false`
   - Console shows: `-> Update needed: Version changed from "0.9" to "1.0"`
   - Console shows: `=== SEED DATABASE: Version changed - updating seed data ===`
   - Old system scholarships are deleted
   - New seed scholarships are imported
   - Console shows: `Storing seed version to localStorage: 1.0`
5. **Verify**:
   - Old system scholarships are gone (check `createdBy: 'system'` count)
   - New seed scholarships appear
   - User-created scholarships (createdBy: 'user') are preserved
   - Version in localStorage is now "1.0"

### Test 4: Empty Database but Version Exists
1. Run in console:
   ```javascript
   localStorage.setItem('scholarship-tracker-seed-version', '1.0')
   // Open DevTools → Application → IndexedDB → Delete database
   ```
2. Refresh the page
3. **Expected behavior**:
   - Console shows: `isFirstTime: true` (database is empty)
   - Console shows: `currentVersion: "1.0"`, `newVersion: "1.0"`
   - Console shows: `versionMatch: true`
   - Despite version match, import proceeds because database is empty
   - Console shows: `=== SEED DATABASE: First time visit - importing all seed data ===`
   - Seed data is imported
4. **Verify**: This ensures edge case where localStorage has version but database is empty

### Test 5: User Data Preservation
1. Create a user scholarship manually (not from seed)
2. Note: It will have `createdBy: 'user'`
3. Run: `localStorage.setItem('scholarship-tracker-seed-version', '0.9')`
4. Refresh the page
5. **Expected behavior**:
   - Seed update occurs
   - Old system scholarships are deleted
   - New seed scholarships are imported
   - **User scholarship is NOT deleted**
6. **Verify**:
   - User scholarship still exists (createdBy: 'user')
   - Check its ID and data - should be unchanged

### Test 6: localStorage Error Handling
1. Open DevTools → Application → Storage
2. Disable "Local storage" (if browser supports this)
3. Refresh the page
4. **Expected behavior**:
   - Console shows: `Error reading seed version from localStorage`
   - Console shows: `currentVersion: null` (error is caught and returns null)
   - Console shows: `-> Update needed: First visit or localStorage unavailable`
   - Seed data is imported despite localStorage error
   - Console shows: `Error storing seed version to localStorage`
   - Import completes but version cannot be stored
5. **Verify**: App works even if localStorage is unavailable

### Test 7: Invalid seedData.json (Missing Version)
1. **Note**: This requires modifying seedData.json file
2. Edit `src/data/seedData.json`, remove `"version": "1.0"` line
3. Rebuild app: `npm run build`
4. Run preview: `npm run preview`
5. Open app
6. **Expected behavior**:
   - Console shows: `Invalid seed data: version field is missing`
   - Console shows: `=== SEED DATABASE: ERROR ===`
   - App handles error gracefully (no crash)
   - User can still use the app, just no seed import

### Test 8: Invalid seedData.json (Missing Scholarships)
1. Edit `src/data/seedData.json`, set `"scholarships": []`
2. Rebuild and preview
3. **Expected behavior**:
   - Console shows: `Invalid seed data: scholarships array is missing or invalid`
   - Error is handled gracefully

## Console Log Interpretation

### Successful Import Log Example
```
=== SEED DATABASE: Starting version check ===
Seed data loaded: {version: "1.0", scholarshipCount: 1, ...}
Retrieved current seed version from localStorage: null
Seed version comparison: {currentVersion: null, newVersion: "1.0", isFirstVisit: true}
-> Update needed: First visit or localStorage unavailable
Seed check results: {isFirstTime: true, needsUpdate: true, ...}
=== SEED DATABASE: First time visit - importing all seed data ===
Starting seed data import: {scholarships: 1, ...}
Importing 1 seed scholarships...
-> Created seed scholarship "LPDP Reguler" with ID 5
Seed scholarship import completed successfully
=== SEED DATABASE: Import successful, updating version to 1.0 ===
Storing seed version to localStorage: 1.0
Seed version stored successfully
=== SEED DATABASE: Import completed successfully ===
Final database state: {totalScholarships: 1, systemScholarships: 1, userScholarships: 0}
=== SEED DATABASE: Process complete ===
```

### Skip Import Log Example
```
=== SEED DATABASE: Starting version check ===
Seed version comparison: {currentVersion: "1.0", newVersion: "1.0", versionMatch: true}
-> No update needed: Versions match
Seed check results: {isFirstTime: false, needsUpdate: false, ...}
=== SEED DATABASE: Version is up to date, skipping import ===
```

## Verification Checklist

### Version Tracking
✅ Version is correctly stored after seed import
✅ Version is retrieved correctly on subsequent visits
✅ Version comparison logic works (matches vs mismatches)
✅ First visit triggers import (no version in localStorage)
✅ Version update triggers reimport (versions differ)
✅ Same version skips import (has data)

### Data Integrity
✅ Updating seed data deletes old system scholarships
✅ New seed scholarships are imported correctly
✅ User-created scholarships (createdBy: 'user') are preserved
✅ No duplicate scholarships appear
✅ Checklist items are imported correctly
✅ Documents and templates only import on first visit

### Error Handling
✅ localStorage errors don't crash the app
✅ Invalid seedData.json is handled gracefully
✅ Empty database triggers import even if version matches
✅ Failed imports don't update version
✅ Detailed error messages for debugging

### Logging
✅ Clear section markers (=== SEED DATABASE: ... ===)
✅ Each step is logged with context
✅ Version comparison shows all relevant values
✅ Import progress is logged (scholarships created)
✅ Final database state is verified and logged
✅ Errors are logged with full context

## How to Debug Issues

### Check Current State
Run in console:
```javascript
// Check stored version
localStorage.getItem('scholarship-tracker-seed-version')

// Check database count
// Use DevTools → Application → IndexedDB

// Manually reset for testing
localStorage.removeItem('scholarship-tracker-seed-version')
```

### Common Issues

**Issue**: Seed data imports every page load
- **Cause**: Version not being stored
- **Check**: Look for "Storing seed version" and "Seed version stored successfully" in console
- **Fix**: Check localStorage is available and working

**Issue**: Version update doesn't trigger reimport
- **Cause**: Version not being read correctly or comparison failing
- **Check**: Look for version comparison logs
- **Fix**: Verify seedData.json version field exists and is string

**Issue**: User data is deleted on update
- **Cause**: Scholarships have wrong createdBy value
- **Check**: Verify user scholarships have `createdBy: 'user'` in IndexedDB
- **Fix**: Check createScholarship function default value

**Issue**: Duplicate scholarships appear
- **Cause**: Old system scholarships not deleted before import
- **Check**: Look for "Deleting X system scholarships" log
- **Fix**: Verify deleteSystemScholarships function runs
