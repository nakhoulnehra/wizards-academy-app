// src/services/meService.js
import { getAuthHeaders } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getMyProfile(signal) {
  const res = await fetch(`${API_URL}/me`, {
    signal,
    headers: { ...getAuthHeaders() },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Failed to load profile (${res.status})`);
  }

  const data = await res.json();
  return data.user;
}

export async function updateMyProfile(payload) {
  const res = await fetch(`${API_URL}/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Failed to update profile (${res.status})`);
  }

  const data = await res.json();
  return data.user;
}
