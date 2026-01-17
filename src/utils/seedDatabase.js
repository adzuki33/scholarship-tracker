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
    const { id, ...scholarshipData } = scholarship;
    
    // Add createdBy marker to identify this as system data
    const created = await createScholarship({
      ...scholarshipData,
      createdBy: 'system'
    });
    
    scholarshipIdMap.set(id, created.id);
    console.log('Created seed scholarship:', scholarship.name);
  }
  
  // Import checklist items for seed scholarships
  for (const item of checklistItems) {
    const { id, scholarshipId, ...itemData } = item;
    const newScholarshipId = scholarshipIdMap.get(scholarshipId);
    
    if (newScholarshipId) {
      await createChecklistItem(newScholarshipId, itemData);
      console.log('Created checklist item:', item.text);
    }
  }
  
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
    
    if (!needsSeedUpdate()) {
      console.log('Seed data is up to date. No import needed.');
      return;
    }
    
    const allScholarships = await getAllScholarships();
    const isFirstTime = allScholarships.length === 0;
    
    if (isFirstTime) {
      console.log('First time visit - importing all seed data...');
    } else {
      console.log('Seed version changed - updating seed data...');
      // Delete old system scholarships before importing new ones
      await deleteSystemScholarships();
    }
    
    const { scholarships, checklistItems, documents, templates } = seedData.data;
    
    // Import seed data with system markers
    await importSeedScholarships(scholarships, checklistItems);
    
    // Only import documents and templates on first visit
    // (these aren't version-controlled to avoid overwriting user data)
    if (isFirstTime) {
      await importSeedDocuments(documents);
      await importSeedTemplates(templates);
    }
    
    // Update the stored version
    setSeedVersion(seedData.version);
    
    console.log(`Seed data ${isFirstTime ? 'imported' : 'updated'} successfully to version ${seedData.version}!`);
    
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
