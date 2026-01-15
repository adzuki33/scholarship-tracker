const DB_NAME = 'ScholarshipTrackerDB';
const DB_VERSION = 1;
const STORE_NAME = 'scholarships';

let db = null;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Database failed to open:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      console.log('Database opened successfully');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      console.log('Database upgrade needed');

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });

        objectStore.createIndex('deadline', 'deadline', { unique: false });
        objectStore.createIndex('status', 'status', { unique: false });
        objectStore.createIndex('createdAt', 'createdAt', { unique: false });

        console.log('Object store created');
      }
    };
  });
};

export const createScholarship = (data) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);

    const scholarshipData = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const request = objectStore.add(scholarshipData);

    request.onsuccess = () => {
      console.log('Scholarship created with ID:', request.result);
      resolve({ ...scholarshipData, id: request.result });
    };

    request.onerror = () => {
      console.error('Error creating scholarship:', request.error);
      reject(request.error);
    };
  });
};

export const getAllScholarships = () => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.getAll();

    request.onsuccess = () => {
      console.log('Retrieved all scholarships:', request.result.length);
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('Error getting all scholarships:', request.error);
      reject(request.error);
    };
  });
};

export const getScholarship = (id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.get(id);

    request.onsuccess = () => {
      console.log('Retrieved scholarship:', request.result);
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('Error getting scholarship:', request.error);
      reject(request.error);
    };
  });
};

export const updateScholarship = (id, data) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    const getRequest = objectStore.get(id);

    getRequest.onsuccess = () => {
      const existingData = getRequest.result;

      if (!existingData) {
        reject(new Error('Scholarship not found'));
        return;
      }

      const updatedData = {
        ...existingData,
        ...data,
        id: id,
        updatedAt: new Date().toISOString(),
      };

      const updateRequest = objectStore.put(updatedData);

      updateRequest.onsuccess = () => {
        console.log('Scholarship updated:', id);
        resolve(updatedData);
      };

      updateRequest.onerror = () => {
        console.error('Error updating scholarship:', updateRequest.error);
        reject(updateRequest.error);
      };
    };

    getRequest.onerror = () => {
      console.error('Error fetching scholarship for update:', getRequest.error);
      reject(getRequest.error);
    };
  });
};

export const deleteScholarship = (id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.delete(id);

    request.onsuccess = () => {
      console.log('Scholarship deleted:', id);
      resolve(id);
    };

    request.onerror = () => {
      console.error('Error deleting scholarship:', request.error);
      reject(request.error);
    };
  });
};

export const clearAllData = () => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.clear();

    request.onsuccess = () => {
      console.log('All data cleared');
      resolve();
    };

    request.onerror = () => {
      console.error('Error clearing data:', request.error);
      reject(request.error);
    };
  });
};
