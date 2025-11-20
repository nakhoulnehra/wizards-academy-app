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
 * Fetch recent programs
 * @param {number} limit - Number of programs to fetch (default: 3)
 * @returns {Promise<{success: boolean, programs: Array}>}
 */
export async function getRecentPrograms(limit = 3) {
  const res = await fetch(`${API_URL}/programs/recent?limit=${limit}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch recent programs: ${res.statusText}`);
  }
  return res.json();
}

