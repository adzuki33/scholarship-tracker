import { getAllScholarships, getAllDocuments, getAllTemplates } from '../db/indexeddb';

export const exportAllData = async () => {
  try {
    console.log('Starting regular data export...');
    
    // Get all data from IndexedDB
    const [scholarships, documents] = await Promise.all([
      getAllScholarships(),
      getAllDocuments()
    ]);
    
    // Get all checklist items for all scholarships
    const checklistItems = [];
    for (const scholarship of scholarships) {
      const { getChecklistItems } = await import('../db/indexeddb');
      const items = await getChecklistItems(scholarship.id);
      checklistItems.push(...items);
    }
    
    // Prepare export data structure (regular format)
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: {
        scholarships,
        checklistItems,
        documents
      }
    };
    
    // Convert to JSON string with pretty formatting
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create filename with current date
    const now = new Date();
    const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const filename = `scholarship-tracker-backup-${dateString}.json`;
    
    // Create and trigger download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`Data exported successfully: ${filename}`);
    console.log(`Exported ${scholarships.length} scholarships, ${checklistItems.length} checklist items, and ${documents.length} documents`);
    
    return {
      success: true,
      filename,
      stats: {
        scholarships: scholarships.length,
        checklistItems: checklistItems.length,
        documents: documents.length
      }
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error(`Export failed: ${error.message}`);
  }
};

export const exportSeedData = async () => {
  try {
    console.log('Starting seed data export...');
    
    // Get all data from IndexedDB
    const [scholarships, documents, templates] = await Promise.all([
      getAllScholarships(),
      getAllDocuments(),
      getAllTemplates()
    ]);
    
    // Get all checklist items for all scholarships
    const checklistItems = [];
    for (const scholarship of scholarships) {
      const { getChecklistItems } = await import('../db/indexeddb');
      const items = await getChecklistItems(scholarship.id);
      checklistItems.push(...items);
    }
    
    // Prepare export data structure (seed format - includes templates)
    const exportData = {
      createdAt: new Date().toISOString(),
      data: {
        scholarships,
        checklistItems,
        documents,
        templates
      }
    };
    
    // Convert to JSON string with pretty formatting
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create filename with current date
    const now = new Date();
    const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const filename = `seedData-${dateString}.json`;
    
    // Create and trigger download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`Seed data exported successfully: ${filename}`);
    console.log(`Exported ${scholarships.length} scholarships, ${checklistItems.length} checklist items, ${documents.length} documents, and ${templates.length} templates`);
    
    return {
      success: true,
      filename,
      createdAt: exportData.createdAt,
      stats: {
        scholarships: scholarships.length,
        checklistItems: checklistItems.length,
        documents: documents.length,
        templates: templates.length
      }
    };
  } catch (error) {
    console.error('Error exporting seed data:', error);
    throw new Error(`Seed data export failed: ${error.message}`);
  }
};

export const saveSeedDataToFile = async () => {
  try {
    console.log('Preparing seed data for GitHub Pages deployment...');
    
    // Get all data from IndexedDB
    const [scholarships, documents, templates] = await Promise.all([
      getAllScholarships(),
      getAllDocuments(),
      getAllTemplates()
    ]);
    
    // Get all checklist items for all scholarships
    const checklistItems = [];
    for (const scholarship of scholarships) {
      const { getChecklistItems } = await import('../db/indexeddb');
      const items = await getChecklistItems(scholarship.id);
      checklistItems.push(...items);
    }
    
    // Prepare seed data structure (compatible with existing seedDatabase.js)
    const seedData = {
      createdAt: new Date().toISOString(),
      data: {
        scholarships,
        checklistItems,
        documents,
        templates
      }
    };
    
    // Convert to JSON string with pretty formatting
    const jsonString = JSON.stringify(seedData, null, 2);
    
    // Create filename for seed data
    const filename = 'seedData.json';
    
    // Create and trigger download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`Seed data prepared for deployment: ${filename}`);
    console.log(`To update GitHub Pages deployment:`);
    console.log(`1. Replace the downloaded file content in src/data/seedData.json`);
    console.log(`2. The createdAt field (${seedData.createdAt}) will trigger reimport for existing users`);
    console.log(`3. Commit and push the changes to your repository`);
    console.log(`4. GitHub Actions will automatically deploy the updated data`);
    
    return {
      success: true,
      filename,
      createdAt: seedData.createdAt,
      instructions: [
        'Download the seedData.json file',
        'Replace src/data/seedData.json content with the downloaded file',
        `The createdAt field (${seedData.createdAt}) will trigger reimport for existing users`,
        'Commit and push changes to GitHub repository',
        'GitHub Actions will automatically deploy the updated data'
      ],
      stats: {
        scholarships: scholarships.length,
        checklistItems: checklistItems.length,
        documents: documents.length,
        templates: templates.length
      }
    };
  } catch (error) {
    console.error('Error saving seed data to file:', error);
    throw new Error(`Seed data file generation failed: ${error.message}`);
  }
};

export const getExportStats = async () => {
  try {
    const [scholarships, documents, templates] = await Promise.all([
      getAllScholarships(),
      getAllDocuments(),
      getAllTemplates()
    ]);
    
    // Get all checklist items for all scholarships
    const checklistItems = [];
    for (const scholarship of scholarships) {
      const { getChecklistItems } = await import('../db/indexeddb');
      const items = await getChecklistItems(scholarship.id);
      checklistItems.push(...items);
    }
    
    return {
      scholarships: scholarships.length,
      checklistItems: checklistItems.length,
      documents: documents.length,
      templates: templates.length,
      totalItems: scholarships.length + checklistItems.length + documents.length + templates.length
    };
  } catch (error) {
    console.error('Error getting export stats:', error);
    return {
      scholarships: 0,
      checklistItems: 0,
      documents: 0,
      templates: 0,
      totalItems: 0
    };
  }
};