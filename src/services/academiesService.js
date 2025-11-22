const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Fetch academies with optional filters and pagination
 * @param {Object} params - Query parameters
 * @param {string} params.city - Filter by city
 * @param {string} params.country - Filter by country code
 * @param {string} params.status - Filter by status (Active, Inactive)
 * @param {string} params.hasPrograms - Filter by has programs (Yes, No, Any)
 * @param {string} params.q - Search query (name or city)
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Items per page (default: 12)
 * @param {string} params.sortBy - Sort field (name, city, createdAt, updatedAt)
 * @param {string} params.sortDir - Sort direction (asc, desc)
 * @returns {Promise<{page: number, pageSize: number, total: number, data: Array}>}
 */
export const getAcademies = async (params = {}) => {
  const {
    city,
    country,
    status,
    hasPrograms,
    q,
    page = 1,
    pageSize = 12,
    sortBy = "name",
    sortDir = "asc",
  } = params;

  const queryParams = new URLSearchParams();
  if (city) queryParams.append("city", city);
  if (country) queryParams.append("country", country);
  if (status) queryParams.append("status", status);
  if (hasPrograms) queryParams.append("hasPrograms", hasPrograms);
  if (q) queryParams.append("q", q);
  queryParams.append("page", page.toString());
  queryParams.append("pageSize", pageSize.toString());
  queryParams.append("sortBy", sortBy);
  queryParams.append("sortDir", sortDir);

  const response = await fetch(`${API_URL}/academies?${queryParams}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch academies: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Fetch available filter options
 * @returns {Promise<{cities: string[], countries: string[], status: string[], hasPrograms: string[]}>}
 */
export const getAcademyFilters = async () => {
  const response = await fetch(`${API_URL}/academies/filters`);
  if (!response.ok) {
    throw new Error(`Failed to fetch filters: ${response.statusText}`);
  }
  return response.json();
};

export const getFeaturedAcademies = async (limit = 3) => {
  const response = await fetch(`${API_URL}/academies/featured?limit=${limit}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch featured academies: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  // Your backend returns { success: true, academies: [...] }
  return data.academies || [];
};
export const getAcademyById = async (id) => {
  if (!id) {
    throw new Error("id is required");
  }

  const response = await fetch(`${API_URL}/academies/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch academy: ${response.statusText}`);
  }
  return response.json();
};
