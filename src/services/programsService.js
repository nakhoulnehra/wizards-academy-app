import { getAuthHeaders } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Fetch programs with optional filters and pagination
 * Each returned item may include `isRegistered: boolean` when an auth token is present.
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

  const searchParams = new URLSearchParams();

  if (city) searchParams.set("city", city);
  if (ageGroup) searchParams.set("ageGroup", ageGroup);
  if (type) searchParams.set("type", type);

  searchParams.set("page", String(page));
  searchParams.set("pageSize", String(pageSize));
  searchParams.set("sortBy", sortBy);
  searchParams.set("sortDir", sortDir);

  const res = await fetch(`${API_URL}/programs/search?${searchParams.toString()}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    let data = {};
    try {
      data = await res.json();
    } catch (e) {
      // ignore json parse error
    }
    throw new Error(data.message || `Failed to load programs (${res.status})`);
  }

  return res.json();
};

/**
 * Fetch filters (locations, ageGroups, types)
 */
export const getProgramFilters = async () => {
  const res = await fetch(`${API_URL}/programs/filters`);

  if (!res.ok) {
    let data = {};
    try {
      data = await res.json();
    } catch (e) {
      // ignore json parse error
    }
    throw new Error(data.message || `Failed to load filters (${res.status})`);
  }

  return res.json();
};

/**
 * Fetch recent programs for landing page hero
 */
export const getRecentPrograms = async (limit = 3) => {
  const params = new URLSearchParams();
  params.set("limit", String(limit));

  const res = await fetch(`${API_URL}/programs/recent?${params.toString()}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    let data = {};
    try {
      data = await res.json();
    } catch (e) {
      // ignore json parse error
    }
    throw new Error(data.message || `Failed to load recent programs (${res.status})`);
  }

  const data = await res.json();
  return data.programs || [];
};

/**
 * Fetch programs for a specific academy
 */
export const getProgramsByAcademy = async (academyId, type) => {
  const params = new URLSearchParams();
  if (type) params.set("type", type);

  const res = await fetch(
    `${API_URL}/programs/by-academy/${academyId}?${params.toString()}`,
    {
      headers: {
        ...getAuthHeaders(),
      },
    }
  );

  if (!res.ok) {
    let data = {};
    try {
      data = await res.json();
    } catch (e) {
      // ignore
    }
    throw new Error(
      data.message || `Failed to load academy programs (${res.status})`
    );
  }

  const data = await res.json();
  return data.data || [];
};

/**
 * ADMIN: create a new program for an academy
 */
export const createProgram = async (academyId, payload) => {
  const {
    title,
    description,
    startDate,
    endDate,
    ageGroupCode,
    type,
    price,
    currency,
  } = payload;

  const body = {
    title,
    description,
    startDate: startDate || null,
    endDate: endDate || null,
    ageGroupCode,
    type,
    price: price != null && price !== "" ? Number(price) : null,
    currency: currency || null,
  };

  const res = await fetch(`${API_URL}/programs/admin/programs/${academyId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    // Handle validation errors array
    if (errorData.errors && Array.isArray(errorData.errors)) {
      const errorMessage = errorData.errors.join("\n- ");
      throw new Error(`Validation error:\n- ${errorMessage}`);
    }
    throw new Error(
      errorData.message || `Failed to create program (${res.status})`
    );
  }

  return res.json();
};

/**
 * Get all programs the current user is enrolled in
 */
export const getMyEnrolledPrograms = async (signal) => {
  const res = await fetch(`${API_URL}/programs/me/enrolled`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    signal, // optional AbortController.signal
  });

  if (!res.ok) {
    let message = "Failed to load enrolled programs";
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch (_) {
      // ignore JSON parse errors, keep default message
    }
    throw new Error(message);
  }

  const body = await res.json();
  return body.data || [];
};

export const getMyDueFees = async (signal) => {
  const res = await fetch(`${API_URL}/programs/me/fees`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    signal, // optional AbortController.signal
  });

  if (!res.ok) {
    let message = "Failed to load due fees";
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch (_) {
      // ignore JSON parse errors, keep default message
    }
    throw new Error(message);
  }

  const body = await res.json();
  return {
    items: Array.isArray(body.items) ? body.items : [],
    totalsByCurrency: Array.isArray(body.totalsByCurrency)
      ? body.totalsByCurrency
      : [],
  };
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
export const updateProgram = async (programId, payload) => {
  const {
    title,
    description,
    startDate,
    endDate,
    ageGroupCode,
    type,
    price,
    currency,
  } = payload;

  const body = {
    title,
    description,
    startDate: startDate || null,
    endDate: endDate || null,
    ageGroupCode,
    type,
    price: price != null && price !== "" ? Number(price) : null,
    currency: currency || null,
  };

  const res = await fetch(`${API_URL}/programs/admin/programs/${programId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    // Handle validation errors array
    if (errorData.errors && Array.isArray(errorData.errors)) {
      const errorMessage = errorData.errors.join("\n- ");
      throw new Error(`Validation error:\n- ${errorMessage}`);
    }
    throw new Error(
      errorData.message || `Failed to update program (${res.status})`
    );
  }

  return res.json();
};

/**
 * ADMIN: delete a program
 */
export const deleteProgram = async (programId) => {
  const res = await fetch(`${API_URL}/programs/admin/programs/${programId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    let data = {};
    try {
      data = await res.json();
    } catch (e) {
      // ignore
    }
    throw new Error(data.message || `Failed to delete program (${res.status})`);
  }

  return res.json();
};

/**
 * Register current user for a program
 */
export const registerForProgram = async (programId) => {
  const res = await fetch(`${API_URL}/programs/${programId}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    let data = {};
    try {
      data = await res.json();
    } catch (e) {
      // ignore
    }
    throw new Error(
      data.message || `Failed to register for program (${res.status})`
    );
  }

  return res.json(); // { success: true, ... }
};

// ADMIN: list registrations (players) for a program
export const getProgramRegistrations = async (programId) => {
  const res = await fetch(
    `${API_URL}/programs/admin/programs/${programId}/registrations`,
    {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    }
  );

  if (!res.ok) {
    let data = {};
    try {
      data = await res.json();
    } catch (_) {
      // ignore
    }
    throw new Error(
      data.message || `Failed to load registrations (${res.status})`
    );
  }

  // { success, programId, title, capacity, enrolledCount, remaining, players: [...] }
  return res.json();
};

// ADMIN: remove a player's registration from a program
export const removeProgramRegistration = async (programId, registrationId) => {
  const res = await fetch(
    `${API_URL}/programs/admin/programs/${programId}/registrations/${registrationId}`,
    {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    }
  );
  if (!res.ok) {
    let data = {};
    try { data = await res.json(); } catch (_) {}
    throw new Error(data.message || `Failed to remove player (${res.status})`);
  }
  return res.json(); // { success, deletedRegistrationId, programId, ... }
};


/**
 * PUBLIC: get single program by id (for view details page)
 */
export const getPublicProgramById = async (programId) => {
  const res = await fetch(`${API_URL}/programs/${programId}`);

  if (!res.ok) {
    let data = {};
    try {
      data = await res.json();
    } catch (e) {
      // ignore
    }
    throw new Error(data.message || `Failed to load program (${res.status})`);
  }

  const data = await res.json();
  return data.program || null;
};
