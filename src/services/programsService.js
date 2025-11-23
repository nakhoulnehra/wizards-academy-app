// api/programs.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Fetch programs with optional filters and pagination
 * @param {Object} params - Query parameters
 * @param {string} params.city - Filter by city
 * @param {string} params.ageGroup - Filter by age group code
 * @param {string} params.type - Filter by type (Academy, Clinic, Tournament)
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Items per page (default: 12)
 * @param {string} params.sortBy - Sort field (startDate, title, price)
 * @param {string} params.sortDir - Sort direction (asc, desc)
 * @returns {Promise<{page: number, pageSize: number, total: number, data: Array}>}
 */
export const getPrograms = async (params = {}) => {
  const {
    city,
    ageGroup,
    type,
    page = 1,
    pageSize = 12,
    sortBy = "startDate",
    sortDir = "desc",
  } = params;

  const queryParams = new URLSearchParams();
  if (city) queryParams.append("city", city);
  if (ageGroup) queryParams.append("ageGroup", ageGroup);
  if (type) queryParams.append("type", type);
  queryParams.append("page", page.toString());
  queryParams.append("pageSize", pageSize.toString());
  queryParams.append("sortBy", sortBy);
  queryParams.append("sortDir", sortDir);

  const response = await fetch(`${API_URL}/programs/search?${queryParams}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch programs: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Fetch available filter options
 * @returns {Promise<{locations: string[], ageGroups: string[], types: string[]}>}
 */
export const getProgramFilters = async () => {
  const response = await fetch(`${API_URL}/programs/filters`);
  if (!response.ok) {
    throw new Error(`Failed to fetch filters: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Fetch recent programs with optional limit
 * @param {number} limit - Number of recent programs to fetch (default: 3, max: 100)
 * @param {AbortSignal} signal - Optional abort signal for request cancellation
 * @returns {Promise<Array>} Array of recent programs
 */
export const getRecentPrograms = async (limit = 3, signal = null) => {
  const validatedLimit = Math.max(1, Math.min(100, parseInt(limit) || 3));
  const queryParams = new URLSearchParams({ limit: validatedLimit.toString() });
  
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (signal) {
    config.signal = signal;
  }
  
  const response = await fetch(`${API_URL}/programs/recent?${queryParams}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || 
      `Failed to fetch recent programs: ${response.statusText}`
    );
  }
  
  const data = await response.json();
  return data.programs || [];
};

/**
 * Get program by ID
 * @param {string|number} id - Program ID
 * @returns {Promise<Object>} Program details
 */
export const getProgramById = async (id) => {
  const response = await fetch(`${API_URL}/programs/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Program not found');
    }
    throw new Error(`Failed to fetch program: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Create a new program
 * @param {Object} programData - Program data
 * @returns {Promise<Object>} Created program
 */
export const createProgram = async (programData) => {
  const response = await fetch(`${API_URL}/programs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(programData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || 
      `Failed to create program: ${response.statusText}`
    );
  }
  
  return response.json();
};

/**
 * Update an existing program
 * @param {string|number} id - Program ID
 * @param {Object} programData - Updated program data
 * @returns {Promise<Object>} Updated program
 */
export const updateProgram = async (id, programData) => {
  const response = await fetch(`${API_URL}/programs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(programData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || 
      `Failed to update program: ${response.statusText}`
    );
  }
  
  return response.json();
};

/**
 * Delete a program
 * @param {string|number} id - Program ID
 * @returns {Promise<Object>} Delete confirmation
 */
export const deleteProgram = async (id) => {
  const response = await fetch(`${API_URL}/programs/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || 
      `Failed to delete program: ${response.statusText}`
    );
  }
  
  return response.json();
};

// Utility functions for data transformation (matching backend helpers)
export const programUtils = {
  /**
   * Convert string to title case
   * @param {string} s - Input string
   * @returns {string} Title-cased string
   */
  toTitle: (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s),
  
  /**
   * Generate slug from title and season
   * @param {string} title - Program title
   * @param {string} season - Program season
   * @returns {string} URL-friendly slug
   */
  slugify: (title, season = '') => {
    const str = `${title}-${season}`.trim();
    return String(str)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 80);
  },
  
  /**
   * Map program type to backend format
   * @param {string} type - Program type
   * @returns {string} Backend type format
   */
  mapTypeToBackend: (type) => {
    if (!type) return undefined;
    const v = String(type).toUpperCase();
    return ["ACADEMY", "CLINIC", "TOURNAMENT"].includes(v) ? v : undefined;
  },
};

export default {
  getPrograms,
  getProgramFilters,
  getRecentPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  utils: programUtils,
};