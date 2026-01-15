const DB_NAME = 'ScholarshipTrackerDB';
const DB_VERSION = 1;
const STORE_NAME = 'scholarships';

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
