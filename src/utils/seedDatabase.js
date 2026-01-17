import seedData from '../data/seedData.json';
import {
  getAllScholarships,
  createScholarship,
  createChecklistItem,
  createDocument,
  createTemplate
} from '../db/indexeddb';

const SEED_MARKER_KEY = 'scholarship-tracker-seeded';

export const isDatabaseSeeded = () => {
  return localStorage.getItem(SEED_MARKER_KEY) === 'true';
};

export const markDatabaseSeeded = () => {
  localStorage.setItem(SEED_MARKER_KEY, 'true');
};

export const seedDatabase = async () => {
  try {
    console.log('Checking if database needs seeding...');
    
    if (isDatabaseSeeded()) {
      console.log('Database already seeded. Skipping...');
      return;
    }

    const existingScholarships = await getAllScholarships();
    if (existingScholarships.length > 0) {
      console.log('Database already contains data. Skipping seed...');
      markDatabaseSeeded();
      return;
    }

    console.log('Seeding database with initial data...');
    
    const { scholarships, checklistItems, documents, templates } = seedData.data;
    
    const scholarshipIdMap = new Map();
    const checklistIdMap = new Map();
    const documentIdMap = new Map();
    const templateIdMap = new Map();

    for (const scholarship of scholarships) {
      const { id, ...scholarshipData } = scholarship;
      const created = await createScholarship(scholarshipData);
      scholarshipIdMap.set(id, created.id);
      console.log('Created scholarship:', scholarship.name);
    }

    for (const item of checklistItems) {
      const { id, scholarshipId, ...itemData } = item;
      const newScholarshipId = scholarshipIdMap.get(scholarshipId);
      if (newScholarshipId) {
        const created = await createChecklistItem(newScholarshipId, itemData);
        checklistIdMap.set(id, created.id);
        console.log('Created checklist item:', item.text);
      }
    }

    for (const document of documents) {
      const { id, ...documentData } = document;
      const created = await createDocument(documentData);
      documentIdMap.set(id, created.id);
      console.log('Created document:', document.name);
    }

    for (const template of templates) {
      const { id, ...templateData } = template;
      const created = await createTemplate(templateData);
      templateIdMap.set(id, created.id);
      console.log('Created template:', template.name);
    }

    markDatabaseSeeded();
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

export const resetSeedMarker = () => {
  localStorage.removeItem(SEED_MARKER_KEY);
  console.log('Seed marker reset. Database will be reseeded on next reload.');
};
