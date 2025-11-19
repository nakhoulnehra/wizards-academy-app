const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const TOKEN_KEY = "wfa_auth_token";

/**
 * Login user and store token
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: {id, email, role, firstName, lastName}}>}
 */
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Login failed");
  }

  const data = await response.json();
  if (data.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
  }
  return data;
};

/**
 * Get current user from stored token
 * @returns {{id: string, email: string, role: string, firstName: string, lastName: string} | null}
 */
export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;

  try {
    // Decode JWT token (simple base64 decode, no verification)
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.sub,
      role: payload.role,
      // Note: email, firstName, lastName are not in JWT payload
      // We'll need to fetch from API or store separately
    };
  } catch (e) {
    console.error("Failed to decode token:", e);
    return null;
  }
};

/**
 * Get stored auth token
 * @returns {string | null}
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Get Authorization header for authenticated requests
 * @returns {{Authorization: string} | {}}
 */
export const getAuthHeaders = () => {
  const token = getToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Logout user and clear token
 */
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

