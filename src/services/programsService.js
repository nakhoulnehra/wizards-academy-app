import { getAuthHeaders } from "./authService";

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
 */
export const getProgramFilters = async () => {
  const response = await fetch(`${API_URL}/programs/filters`);
  if (!response.ok) {
    throw new Error(`Failed to fetch filters: ${response.statusText}`);
  }
  return response.json();
};

export const getProgramsByAcademy = async (academyId, options = {}) => {
  if (!academyId) {
    throw new Error("academyId is required");
  }

  const queryParams = new URLSearchParams();
  if (options.type) queryParams.append("type", options.type);

  const url = `${API_URL}/programs/by-academy/${academyId}${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch programs for academy: ${response.statusText}`
    );
  }
  // backend returns { success: true, data: [...] }
  const data = await response.json();
  return data.data || [];
};

export async function getRecentPrograms(limit = 3, signal) {
  const url = `${API_URL}/programs/recent?limit=${limit}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Failed to load programs (${res.status})`);
  }
  const data = await res.json();
  return data.programs || [];
}

export const createProgram = async (academyId, type, data) => {
  const res = await fetch(`${API_URL}/programs/admin/programs/${academyId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(), // ✅ Authorization header
    },
    body: JSON.stringify({ ...data, type }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Failed to create program (${res.status}) ${text || ""}`.trim()
    );
  }

  return res.json();
};

/**
 * ADMIN: get single program by id (for editing)
 */
export const getProgramById = async (programId) => {
  const res = await fetch(`${API_URL}/programs/admin/programs/${programId}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Failed to load program (${res.status}) ${text || ""}`.trim()
    );
  }

  const data = await res.json();
  return data.program || null;
};

/**
 * ADMIN: update existing program
 */
export const updateProgram = async (programId, data) => {
  const res = await fetch(`${API_URL}/programs/admin/programs/${programId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Failed to update program (${res.status}) ${text || ""}`.trim()
    );
  }

  const body = await res.json();
  return body.program;
};

/**
 * ADMIN: delete program
 */
export const deleteProgram = async (programId) => {
  const res = await fetch(`${API_URL}/programs/admin/programs/${programId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Failed to delete program (${res.status}) ${text || ""}`.trim()
    );
  }

  return true;
};
