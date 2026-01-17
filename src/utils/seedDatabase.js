/**
 * Seed Database Utility with Versioning System
 * 
 * This module handles intelligent seed data import with version tracking.
 * When the seed data version is updated, it reimports seed scholarships while
 * preserving user-created data.
 * 
 * How to update seed data:
 * 1. Export your data as "Seed Data Export" from Data Management
 * 2. Replace src/data/seedData.json with the exported file
 * 3. Increment the "version" field in seedData.json (e.g., "1.0" -> "1.1")
 * 4. Commit and deploy - returning visitors will automatically get updated seed data
 * 
 * The versioning system:
 * - Tracks current seed version in localStorage
 * - Compares with seedData.json version on each app load
 * - If versions differ, reimports seed data intelligently
 * - Deletes old system scholarships (createdBy: 'system')
 * - Imports new seed scholarships with createdBy: 'system'
 * - Preserves user scholarships (createdBy: 'user')
 */

import seedData from '../data/seedData.json';
import {
  getAllScholarships,
  createScholarship,
  deleteScholarship,
  createChecklistItem,
  getChecklistItems,
  deleteChecklistItem,
  createDocument,
  createTemplate
} from '../db/indexeddb';

const SEED_VERSION_KEY = 'scholarship-tracker-seed-version';

/**
 * Get the currently installed seed data version
 */
export const getCurrentSeedVersion = () => {
  try {
    const version = localStorage.getItem(SEED_VERSION_KEY);
    console.log('Retrieved current seed version from localStorage:', version);
    return version;
  } catch (error) {
    console.error('Error reading seed version from localStorage:', error);
    return null;
  }
};

/**
 * Save the current seed data version
 */
export const setSeedVersion = (version) => {
  try {
    console.log('Storing seed version to localStorage:', version);
    localStorage.setItem(SEED_VERSION_KEY, version);
    console.log('Seed version stored successfully');
  } catch (error) {
    console.error('Error storing seed version to localStorage:', error);
    throw error;
  }
};

/**
 * Check if seed data needs to be updated
 */
export const needsSeedUpdate = () => {
  const currentVersion = getCurrentSeedVersion();
  const newVersion = seedData?.version;

  console.log('Seed version comparison:', {
    currentVersion,
    newVersion,
    versionMatch: currentVersion === newVersion,
    isFirstVisit: !currentVersion
  });

  // First time visit - no version set (including case where localStorage is inaccessible)
  if (!currentVersion) {
    console.log('-> Update needed: First visit or localStorage unavailable');
    return true;
  }

  // Missing version in seed data - treat as needing update to be safe
  if (!newVersion) {
    console.log('-> Update needed: Seed data missing version field');
    return true;
  }

  // Version mismatch - need update
  if (currentVersion !== newVersion) {
    console.log(`-> Update needed: Version changed from "${currentVersion}" to "${newVersion}"`);
    return true;
  }

  console.log('-> No update needed: Versions match');
  return false;
};

/**
 * Delete all system-created scholarships and their checklist items
 * This preserves user-created scholarships
 */
const deleteSystemScholarships = async () => {
  const allScholarships = await getAllScholarships();
  const systemScholarships = allScholarships.filter(s => s.createdBy === 'system');
  
  console.log(`Deleting ${systemScholarships.length} system scholarships...`);
  
  for (const scholarship of systemScholarships) {
    // Delete associated checklist items first
    const checklistItems = await getChecklistItems(scholarship.id);
    for (const item of checklistItems) {
      await deleteChecklistItem(item.id);
    }
    
    // Delete the scholarship
    await deleteScholarship(scholarship.id);
    console.log('Deleted system scholarship:', scholarship.name);
  }
};

/**
 * Import seed scholarships with createdBy: 'system' marker
 */
const importSeedScholarships = async (scholarships, checklistItems) => {
  const scholarshipIdMap = new Map();

  console.log(`Importing ${scholarships.length} seed scholarships...`);

  for (const scholarship of scholarships) {
    try {
      const { id, ...scholarshipData } = scholarship;

      // Add createdBy marker to identify this as system data
      const created = await createScholarship({
        ...scholarshipData,
        createdBy: 'system'
      });

      scholarshipIdMap.set(id, created.id);
      console.log(`-> Created seed scholarship "${scholarship.name}" with ID ${created.id}`);
    } catch (error) {
      console.error(`-> FAILED to import scholarship "${scholarship.name}":`, error);
      throw new Error(`Failed to import scholarship "${scholarship.name}": ${error.message}`);
    }
  }

  console.log(`Importing ${checklistItems?.length || 0} seed checklist items...`);

  // Import checklist items for seed scholarships
  if (checklistItems && checklistItems.length > 0) {
    for (const item of checklistItems) {
      try {
        const { id, scholarshipId, ...itemData } = item;
        const newScholarshipId = scholarshipIdMap.get(scholarshipId);

        if (newScholarshipId) {
          await createChecklistItem(newScholarshipId, itemData);
          console.log(`-> Created checklist item "${item.text}" for scholarship ID ${newScholarshipId}`);
        } else {
          console.warn(`-> Skipping checklist item "${item.text}" for unknown scholarship ID ${scholarshipId}`);
        }
      } catch (error) {
        console.error(`-> FAILED to import checklist item "${item.text}":`, error);
        throw new Error(`Failed to import checklist item "${item.text}": ${error.message}`);
      }
    }
  } else {
    console.log('-> No checklist items to import');
  }

  console.log('Seed scholarship import completed successfully');
  return scholarshipIdMap;
};

/**
 * Import seed documents
 */
const importSeedDocuments = async (documents) => {
  const documentIdMap = new Map();
  
  for (const document of documents) {
    const { id, ...documentData } = document;
    const created = await createDocument(documentData);
    documentIdMap.set(id, created.id);
    console.log('Created document:', document.name);
  }
  
  return documentIdMap;
};

/**
 * Import seed templates
 */
const importSeedTemplates = async (templates) => {
  const templateIdMap = new Map();
  
  for (const template of templates) {
    const { id, ...templateData } = template;
    const created = await createTemplate(templateData);
    templateIdMap.set(id, created.id);
    console.log('Created template:', template.name);
  }
  
  return templateIdMap;
};

/**
 * Main seed database function with versioning support
 * This function:
 * - Checks if seed data version has changed
 * - On first visit: imports all seed data
 * - On version change: reimports seed scholarships, preserves user data
 * - On same version: does nothing
 */
export const seedDatabase = async () => {
  try {
    console.log('=== SEED DATABASE: Starting version check ===');
    console.log('Seed data loaded:', {
      version: seedData?.version,
      hasData: !!seedData?.data,
      scholarshipCount: seedData?.data?.scholarships?.length || 0,
      checklistItemCount: seedData?.data?.checklistItems?.length || 0
    });
    
    // Validate seed data structure
    if (!seedData) {
      console.error('Invalid seed data: seedData is null/undefined');
      throw new Error('Seed data is invalid or missing');
    }
    
    if (!seedData.version) {
      console.error('Invalid seed data: version field is missing');
      throw new Error('Seed data version is missing');
    }
    
    if (!seedData.data || !Array.isArray(seedData.data.scholarships)) {
      console.error('Invalid seed data: scholarships array is missing', seedData.data);
      throw new Error('Seed data scholarships array is missing or invalid');
    }
    
    const allScholarships = await getAllScholarships();
    const isFirstTime = allScholarships.length === 0;
    const needsUpdate = needsSeedUpdate();
    
    console.log('Seed check results:', {
      isFirstTime,
      needsUpdate,
      scholarshipCount: allScholarships.length,
      currentVersion: getCurrentSeedVersion(),
      newVersion: seedData.version
    });
    
    // Only skip import if we don't need an update AND we already have data
    if (!needsUpdate && !isFirstTime) {
      console.log('=== SEED DATABASE: Version is up to date, skipping import ===');
      return;
    }
    
    if (isFirstTime) {
      console.log('=== SEED DATABASE: First time visit - importing all seed data ===');
    } else {
      console.log('=== SEED DATABASE: Version changed - updating seed data ===');
      // Delete old system scholarships before importing new ones
      await deleteSystemScholarships();
    }
    
    const { scholarships, checklistItems, documents, templates } = seedData.data;
    
    console.log('Starting seed data import:', {
      scholarships: scholarships.length,
      checklistItems: checklistItems?.length || 0,
      documents: documents?.length || 0,
      templates: templates?.length || 0
    });
    
    // Import seed data with system markers
    await importSeedScholarships(scholarships, checklistItems || []);
    
    // Only import documents and templates on first visit
    // (these aren't version-controlled to avoid overwriting user data)
    if (isFirstTime) {
      if (documents && documents.length > 0) {
        await importSeedDocuments(documents);
      } else {
        console.log('No seed documents to import');
      }
      
      if (templates && templates.length > 0) {
        await importSeedTemplates(templates);
      } else {
        console.log('No seed templates to import');
      }
    }
    
    // Only update the stored version AFTER successful import
    console.log(`=== SEED DATABASE: Import successful, updating version to ${seedData.version} ===`);
    setSeedVersion(seedData.version);
    
    // Verify import by checking the database
    const finalScholarships = await getAllScholarships();
    console.log(`=== SEED DATABASE: ${isFirstTime ? 'Import' : 'Update'} completed successfully ===`);
    console.log('Final database state:', {
      totalScholarships: finalScholarships.length,
      systemScholarships: finalScholarships.filter(s => s.createdBy === 'system').length,
      userScholarships: finalScholarships.filter(s => s.createdBy === 'user').length
    });
    
    console.log('=== SEED DATABASE: Process complete ===');
    
  } catch (error) {
    console.error('=== SEED DATABASE: ERROR ===');
    console.error('Error seeding database:', error);
    // Do NOT store the version if import failed
    console.error('Version was NOT stored due to import failure');
    throw error;
  }
};

/**
 * Reset seed version marker (for testing/debugging)
 * This will cause the seed data to be reimported on next reload
 */
export const resetSeedVersion = () => {
  localStorage.removeItem(SEED_VERSION_KEY);
  console.log('Seed version reset. Database will be reseeded on next reload.');
};
