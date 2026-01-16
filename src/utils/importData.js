import { 
  clearAllData, 
  createScholarship, 
  createChecklistItem, 
  createDocument 
} from '../db/indexeddb';

// Import strategy constants
export const IMPORT_STRATEGIES = {
  REPLACE_ALL: 'replace_all',
  MERGE: 'merge'
};

// Validate the structure and content of imported data
export const validateImportData = (jsonData) => {
  const errors = [];
  const warnings = [];
  
  // Check if it's a valid object
  if (!jsonData || typeof jsonData !== 'object') {
    errors.push('Invalid JSON format: data must be a JSON object');
    return { valid: false, errors, warnings };
  }
  
  // Check for version field
  if (!jsonData.version) {
    warnings.push('No version field found - assuming version 1.0 compatibility');
    jsonData.version = '1.0';
  }
  
  // Check for data field
  if (!jsonData.data || typeof jsonData.data !== 'object') {
    errors.push('Missing or invalid data field - expected object with scholarships, checklistItems, and documents');
    return { valid: false, errors, warnings };
  }
  
  const { scholarships = [], checklistItems = [], documents = [] } = jsonData.data;
  
  // Validate scholarships array
  if (!Array.isArray(scholarships)) {
    errors.push('Scholarships field must be an array');
  } else {
    scholarships.forEach((scholarship, index) => {
      if (!scholarship || typeof scholarship !== 'object') {
        errors.push(`Scholarship at index ${index} must be an object`);
        return;
      }
      
      // Check required fields
      const requiredFields = ['name', 'provider', 'deadline'];
      requiredFields.forEach(field => {
        if (!scholarship[field]) {
          errors.push(`Scholarship "${scholarship.name || 'Unknown'}" is missing required field: ${field}`);
        }
      });
      
      // Validate data types
      if (scholarship.applicationYear && typeof scholarship.applicationYear !== 'number') {
        errors.push(`Scholarship "${scholarship.name || 'Unknown'}" has invalid applicationYear type`);
      }
      
      if (scholarship.requiredDocumentIds && !Array.isArray(scholarship.requiredDocumentIds)) {
        warnings.push(`Scholarship "${scholarship.name || 'Unknown'}" has invalid requiredDocumentIds type, will be normalized`);
      }
    });
  }
  
  // Validate checklistItems array
  if (!Array.isArray(checklistItems)) {
    errors.push('ChecklistItems field must be an array');
  } else {
    checklistItems.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        errors.push(`Checklist item at index ${index} must be an object`);
        return;
      }
      
      // Check required fields
      if (!item.text) {
        errors.push(`Checklist item at index ${index} is missing required field: text`);
      }
      
      if (item.scholarshipId === undefined || item.scholarshipId === null) {
        errors.push(`Checklist item at index ${index} is missing required field: scholarshipId`);
      }
      
      // Validate data types
      if (typeof item.checked !== 'boolean') {
        warnings.push(`Checklist item "${item.text || 'Unknown'}" has invalid checked type, defaulting to false`);
      }
      
      if (typeof item.order !== 'number') {
        warnings.push(`Checklist item "${item.text || 'Unknown'}" has invalid order type, defaulting to 0`);
      }
    });
  }
  
  // Validate documents array
  if (!Array.isArray(documents)) {
    errors.push('Documents field must be an array');
  } else {
    documents.forEach((document, index) => {
      if (!document || typeof document !== 'object') {
        errors.push(`Document at index ${index} must be an object`);
        return;
      }
      
      // Check required fields
      const requiredFields = ['name', 'type'];
      requiredFields.forEach(field => {
        if (!document[field]) {
          errors.push(`Document "${document.name || 'Unknown'}" is missing required field: ${field}`);
        }
      });
      
      // Validate status if present
      const validStatuses = ['NotReady', 'Draft', 'Final', 'Uploaded'];
      if (document.status && !validStatuses.includes(document.status)) {
        warnings.push(`Document "${document.name || 'Unknown'}" has invalid status "${document.status}", defaulting to NotReady`);
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    data: jsonData.data,
    version: jsonData.version
  };
};

// Import data with specified strategy
export const importData = async (jsonData, strategy = IMPORT_STRATEGIES.REPLACE_ALL) => {
  try {
    console.log(`Starting data import with strategy: ${strategy}`);
    
    // Validate import data
    const validation = validateImportData(jsonData);
    if (!validation.valid) {
      throw new Error(`Invalid data: ${validation.errors.join(', ')}`);
    }
    
    const { data } = validation;
    const { scholarships = [], checklistItems = [], documents = [] } = data;
    
    // Clear existing data if using REPLACE_ALL strategy
    if (strategy === IMPORT_STRATEGIES.REPLACE_ALL) {
      console.log('Clearing existing data...');
      await clearAllData();
      
      // Also need to clear checklist items and documents
      // This would require implementing clear methods for these stores
      // For now, we'll work with the assumption that clearAllData clears all stores
      console.log('Existing data cleared');
    }
    
    const results = {
      scholarships: { created: 0, errors: [] },
      checklistItems: { created: 0, errors: [] },
      documents: { created: 0, errors: [] }
    };
    
    // Import scholarships first
    console.log(`Importing ${scholarships.length} scholarships...`);
    for (const scholarship of scholarships) {
      try {
        // Remove id field to let IndexedDB auto-increment
        const { id, ...scholarshipData } = scholarship;
        
        // Normalize requiredDocumentIds
        if (scholarshipData.requiredDocumentIds && !Array.isArray(scholarshipData.requiredDocumentIds)) {
          scholarshipData.requiredDocumentIds = [];
        }
        
        await createScholarship(scholarshipData);
        results.scholarships.created++;
      } catch (error) {
        console.error('Error importing scholarship:', scholarship.name, error);
        results.scholarships.errors.push(`${scholarship.name}: ${error.message}`);
      }
    }
    
    // Import documents next
    console.log(`Importing ${documents.length} documents...`);
    for (const document of documents) {
      try {
        // Remove id field to let IndexedDB auto-increment
        const { id, ...documentData } = document;
        
        // Normalize status
        const validStatuses = ['NotReady', 'Draft', 'Final', 'Uploaded'];
        if (documentData.status && !validStatuses.includes(documentData.status)) {
          documentData.status = 'NotReady';
        }
        
        await createDocument(documentData);
        results.documents.created++;
      } catch (error) {
        console.error('Error importing document:', document.name, error);
        results.documents.errors.push(`${document.name}: ${error.message}`);
      }
    }
    
    // Import checklist items last
    console.log(`Importing ${checklistItems.length} checklist items...`);
    for (const item of checklistItems) {
      try {
        // Remove id field to let IndexedDB auto-increment
        const { id, ...itemData } = item;
        
        // Validate required fields
        if (!itemData.scholarshipId) {
          throw new Error('Missing scholarshipId');
        }
        
        // Normalize data types
        itemData.checked = Boolean(itemData.checked);
        itemData.order = Number(itemData.order) || 0;
        if (!itemData.text) {
          throw new Error('Missing text field');
        }
        
        await createChecklistItem(itemData.scholarshipId, itemData);
        results.checklistItems.created++;
      } catch (error) {
        console.error('Error importing checklist item:', item.text, error);
        results.checklistItems.errors.push(`${item.text || 'Unknown'}: ${error.message}`);
      }
    }
    
    console.log('Import completed:', results);
    
    return {
      success: true,
      strategy,
      results,
      warnings: validation.warnings
    };
    
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error(`Import failed: ${error.message}`);
  }
};

// Parse JSON file content
export const parseImportFile = (fileContent) => {
  try {
    const jsonData = JSON.parse(fileContent);
    return { success: true, data: jsonData };
  } catch (error) {
    console.error('Error parsing JSON file:', error);
    return { 
      success: false, 
      error: `Invalid JSON format: ${error.message}` 
    };
  }
};

// Get import preview from JSON data
export const getImportPreview = (jsonData) => {
  try {
    const validation = validateImportData(jsonData);
    if (!validation.valid) {
      return {
        valid: false,
        errors: validation.errors,
        warnings: validation.warnings
      };
    }
    
    const { scholarships = [], checklistItems = [], documents = [] } = validation.data;
    
    return {
      valid: true,
      warnings: validation.warnings,
      stats: {
        scholarships: scholarships.length,
        checklistItems: checklistItems.length,
        documents: documents.length,
        totalItems: scholarships.length + checklistItems.length + documents.length
      }
    };
  } catch (error) {
    console.error('Error generating import preview:', error);
    return {
      valid: false,
      errors: [`Preview generation failed: ${error.message}`]
    };
  }
};