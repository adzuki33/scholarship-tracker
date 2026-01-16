/**
 * Search scholarships by query across multiple fields
 * @param {Array} scholarships - Array of scholarship objects
 * @param {string} query - Search query string
 * @returns {Array} Filtered scholarships matching the query
 */
export const searchScholarships = (scholarships, query) => {
  if (!query || !query.trim()) {
    return scholarships;
  }

  const searchTerm = query.toLowerCase().trim();

  return scholarships.filter((scholarship) => {
    // Search in name
    const nameMatch = scholarship.name?.toLowerCase().includes(searchTerm);
    // Search in provider
    const providerMatch = scholarship.provider?.toLowerCase().includes(searchTerm);
    // Search in country
    const countryMatch = scholarship.country?.toLowerCase().includes(searchTerm);

    return nameMatch || providerMatch || countryMatch;
  });
};

/**
 * Get unique countries from scholarships
 * @param {Array} scholarships - Array of scholarship objects
 * @returns {Array} Sorted array of unique countries
 */
export const getUniqueCountries = (scholarships) => {
  const countries = new Set();
  scholarships.forEach((scholarship) => {
    if (scholarship.country) {
      countries.add(scholarship.country);
    }
  });
  return Array.from(countries).sort();
};

/**
 * Get available statuses from scholarships
 * @param {Array} scholarships - Array of scholarship objects
 * @returns {Array} Sorted array of unique statuses
 */
export const getUniqueStatuses = (scholarships) => {
  const statuses = new Set();
  scholarships.forEach((scholarship) => {
    if (scholarship.status) {
      statuses.add(scholarship.status);
    }
  });
  return Array.from(statuses).sort();
};
