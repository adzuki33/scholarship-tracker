import { getAllScholarships, getAllDocuments } from '../db/indexeddb';

export const exportAllData = async () => {
  try {
    console.log('Starting data export...');
    
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
    
    // Prepare export data structure
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

export const getExportStats = async () => {
  try {
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
    
    return {
      scholarships: scholarships.length,
      checklistItems: checklistItems.length,
      documents: documents.length,
      totalItems: scholarships.length + checklistItems.length + documents.length
    };
  } catch (error) {
    console.error('Error getting export stats:', error);
    return {
      scholarships: 0,
      checklistItems: 0,
      documents: 0,
      totalItems: 0
    };
  }
};