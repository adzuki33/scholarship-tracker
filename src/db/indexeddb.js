const DB_NAME = 'ScholarshipTrackerDB';
const DB_VERSION = 2;
const STORE_NAME = 'scholarships';
const CHECKLIST_STORE_NAME = 'checklistItems';

let db = null;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Error opening IndexedDB:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      console.log('IndexedDB opened successfully');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('deadline', 'deadline', { unique: false });
        objectStore.createIndex('status', 'status', { unique: false });
        console.log('Object store created:', STORE_NAME);
      }
      if (!db.objectStoreNames.contains(CHECKLIST_STORE_NAME)) {
        const checklistStore = db.createObjectStore(CHECKLIST_STORE_NAME, { keyPath: 'id', autoIncrement: true });
        checklistStore.createIndex('scholarshipId', 'scholarshipId', { unique: false });
        checklistStore.createIndex('order', 'order', { unique: false });
        console.log('Object store created:', CHECKLIST_STORE_NAME);
      }
    };
  });
};

export const createScholarship = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await initDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      
      const scholarship = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const request = objectStore.add(scholarship);

      request.onsuccess = () => {
        console.log('Scholarship created with ID:', request.result);
        resolve({ ...scholarship, id: request.result });
      };

      request.onerror = () => {
        console.error('Error creating scholarship:', request.error);
        reject(request.error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllScholarships = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await initDB();
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        const scholarships = request.result;
        console.log('Retrieved scholarships:', scholarships.length);
        resolve(scholarships);
      };

      request.onerror = () => {
        console.error('Error getting scholarships:', request.error);
        reject(request.error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const getScholarship = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      await initDB();
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.get(id);

      request.onsuccess = () => {
        console.log('Retrieved scholarship:', id);
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Error getting scholarship:', request.error);
        reject(request.error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const updateScholarship = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await initDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      
      const request = objectStore.get(id);

      request.onsuccess = () => {
        const existing = request.result;
        if (!existing) {
          reject(new Error('Scholarship not found'));
          return;
        }

        const updated = {
          ...existing,
          ...data,
          updatedAt: new Date().toISOString()
        };

        const updateRequest = objectStore.put(updated);

        updateRequest.onsuccess = () => {
          console.log('Scholarship updated:', id);
          resolve(updated);
        };

        updateRequest.onerror = () => {
          console.error('Error updating scholarship:', updateRequest.error);
          reject(updateRequest.error);
        };
      };

      request.onerror = () => {
        console.error('Error getting scholarship for update:', request.error);
        reject(request.error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteScholarship = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      await initDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        console.log('Scholarship deleted:', id);
        resolve();
      };

      request.onerror = () => {
        console.error('Error deleting scholarship:', request.error);
        reject(request.error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const clearAllData = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await initDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.clear();

      request.onsuccess = () => {
        console.log('All scholarships cleared');
        resolve();
      };

      request.onerror = () => {
        console.error('Error clearing data:', request.error);
        reject(request.error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const createChecklistItem = (scholarshipId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await initDB();
      const transaction = db.transaction([CHECKLIST_STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(CHECKLIST_STORE_NAME);

      const checklistItem = {
        scholarshipId,
        text: data.text,
        checked: data.checked || false,
        note: data.note || '',
        order: data.order || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const request = objectStore.add(checklistItem);

      request.onsuccess = () => {
        console.log('Checklist item created with ID:', request.result);
        resolve({ ...checklistItem, id: request.result });
      };

      request.onerror = () => {
        console.error('Error creating checklist item:', request.error);
        reject(request.error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const getChecklistItems = (scholarshipId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await initDB();
      const transaction = db.transaction([CHECKLIST_STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(CHECKLIST_STORE_NAME);
      const index = objectStore.index('scholarshipId');
      const request = index.getAll(scholarshipId);

      request.onsuccess = () => {
        const items = request.result.sort((a, b) => a.order - b.order);
        console.log('Retrieved checklist items:', items.length, 'for scholarship:', scholarshipId);
        resolve(items);
      };

      request.onerror = () => {
        console.error('Error getting checklist items:', request.error);
        reject(request.error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const updateChecklistItem = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await initDB();
      const transaction = db.transaction([CHECKLIST_STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(CHECKLIST_STORE_NAME);

      const request = objectStore.get(id);

      request.onsuccess = () => {
        const existing = request.result;
        if (!existing) {
          reject(new Error('Checklist item not found'));
          return;
        }

        const updated = {
          ...existing,
          ...data,
          updatedAt: new Date().toISOString()
        };

        const updateRequest = objectStore.put(updated);

        updateRequest.onsuccess = () => {
          console.log('Checklist item updated:', id);
          resolve(updated);
        };

        updateRequest.onerror = () => {
          console.error('Error updating checklist item:', updateRequest.error);
          reject(updateRequest.error);
        };
      };

      request.onerror = () => {
        console.error('Error getting checklist item for update:', request.error);
        reject(request.error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteChecklistItem = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      await initDB();
      const transaction = db.transaction([CHECKLIST_STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(CHECKLIST_STORE_NAME);
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        console.log('Checklist item deleted:', id);
        resolve();
      };

      request.onerror = () => {
        console.error('Error deleting checklist item:', request.error);
        reject(request.error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const reorderChecklistItems = (scholarshipId, items) => {
  return new Promise(async (resolve, reject) => {
    try {
      await initDB();
      const transaction = db.transaction([CHECKLIST_STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(CHECKLIST_STORE_NAME);

      let completed = 0;
      const total = items.length;
      const updatedItems = [];

      items.forEach((item, index) => {
        const getRequest = objectStore.get(item.id);

        getRequest.onsuccess = () => {
          const existing = getRequest.result;
          if (!existing) {
            reject(new Error('Checklist item not found'));
            return;
          }

          const updated = {
            ...existing,
            order: index,
            updatedAt: new Date().toISOString()
          };

          const putRequest = objectStore.put(updated);

          putRequest.onsuccess = () => {
            updatedItems.push(updated);
            completed++;
            if (completed === total) {
              console.log('Checklist items reordered for scholarship:', scholarshipId);
              resolve(updatedItems);
            }
          };

          putRequest.onerror = () => {
            console.error('Error reordering checklist item:', putRequest.error);
            reject(putRequest.error);
          };
        };

        getRequest.onerror = () => {
          console.error('Error getting checklist item for reorder:', getRequest.error);
          reject(getRequest.error);
        };
      });
    } catch (error) {
      reject(error);
    }
  });
};
