// src/services/authService.js

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

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || "Failed to log in");
  }

  if (data.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
  }

  return data; // { token, user }
};

/**
 * Signup user (creates CLIENT user, status ACTIVE)
 * @param {{email:string,password:string,firstName:string,lastName:string,phone?:string|null}} payload
 * @returns {Promise<{message:string}>}
 */
export const signup = async ({
  email,
  password,
  firstName,
  lastName,
  phone,
}) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      firstName,
      lastName,
      phone: phone || null,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || "Failed to create account");
  }

  // Backend returns: { message: 'Signup successful. You can now log in.' }
  return data;
};

/**
 * Get stored auth token
 */
export const getToken = () => {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get Authorization header for authenticated requests
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
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
};
