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
  return localStorage.getItem(SEED_VERSION_KEY);
};

/**
 * Save the current seed data version
 */
export const setSeedVersion = (version) => {
  localStorage.setItem(SEED_VERSION_KEY, version);
};

/**
 * Check if seed data needs to be updated
 */
export const needsSeedUpdate = () => {
  const currentVersion = getCurrentSeedVersion();
  const newVersion = seedData.version;
  
  console.log('Seed version check:', { currentVersion, newVersion });
  
  // First time visit - no version set
  if (!currentVersion) {
    return true;
  }
  
  // Version mismatch - need update
  if (currentVersion !== newVersion) {
    return true;
  }
  
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
      console.log('Created seed scholarship:', scholarship.name);
    } catch (error) {
      console.error('Error importing scholarship:', scholarship.name, error);
      throw error;
    }
  }
  
  console.log(`Importing ${checklistItems.length} seed checklist items...`);
  
  // Import checklist items for seed scholarships
  for (const item of checklistItems) {
    try {
      const { id, scholarshipId, ...itemData } = item;
      const newScholarshipId = scholarshipIdMap.get(scholarshipId);
      
      if (newScholarshipId) {
        await createChecklistItem(newScholarshipId, itemData);
        console.log('Created checklist item:', item.text);
      } else {
        console.warn('Skipping checklist item for unknown scholarship:', scholarshipId);
      }
    } catch (error) {
      console.error('Error importing checklist item:', item.text, error);
      throw error;
    }
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
    console.log('Checking seed data version...');
    console.log('Seed data loaded:', {
      version: seedData?.version,
      hasData: !!seedData?.data,
      scholarshipCount: seedData?.data?.scholarships?.length || 0,
      checklistItemCount: seedData?.data?.checklistItems?.length || 0
    });
    
    // Validate seed data structure
    if (!seedData || !seedData.data || !seedData.data.scholarships) {
      console.error('Invalid seed data structure!', seedData);
      throw new Error('Seed data is invalid or missing');
    }
    
    const allScholarships = await getAllScholarships();
    const isFirstTime = allScholarships.length === 0;
    const needsUpdate = needsSeedUpdate();
    
    console.log('Seed check results:', {
      isFirstTime,
      needsUpdate,
      scholarshipCount: allScholarships.length
    });
    
    // Only skip import if we don't need an update AND we already have data
    if (!needsUpdate && !isFirstTime) {
      console.log('Seed data is up to date. No import needed.');
      return;
    }
    
    if (isFirstTime) {
      console.log('First time visit - importing all seed data...');
    } else {
      console.log('Seed version changed - updating seed data...');
      // Delete old system scholarships before importing new ones
      await deleteSystemScholarships();
    }
    
    const { scholarships, checklistItems, documents, templates } = seedData.data;
    
    console.log('Starting seed data import:', {
      scholarships: scholarships.length,
      checklistItems: checklistItems.length,
      documents: documents?.length || 0,
      templates: templates?.length || 0
    });
    
    // Import seed data with system markers
    await importSeedScholarships(scholarships, checklistItems);
    
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
    
    // Update the stored version
    setSeedVersion(seedData.version);
    
    // Verify import by checking the database
    const finalScholarships = await getAllScholarships();
    console.log(`Seed data ${isFirstTime ? 'imported' : 'updated'} successfully to version ${seedData.version}!`);
    console.log('Final database state:', {
      totalScholarships: finalScholarships.length,
      systemScholarships: finalScholarships.filter(s => s.createdBy === 'system').length,
      userScholarships: finalScholarships.filter(s => s.createdBy === 'user').length
    });
    
  } catch (error) {
    console.error('Error seeding database:', error);
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
