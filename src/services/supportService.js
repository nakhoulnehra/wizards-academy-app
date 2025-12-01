// src/services/supportService.js
import { getAuthHeaders } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Public: create support request from contact form
 */
export async function createSupportRequest({ name, email, message }) {
  const res = await fetch(`${API_URL}/support`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(), // optional – if user logged in
    },
    body: JSON.stringify({ name, email, message }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to send message");
  }
  return data.data;
}

/**
 * Admin: list all support requests
 */
export async function getSupportRequests() {
  const res = await fetch(`${API_URL}/support`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to load messages");
  }
  return data.data || [];
}

/**
 * Admin: send a reply (no email, just logged on backend)
 */
export async function replyToSupportRequest(id, reply) {
  const res = await fetch(`${API_URL}/support/${id}/reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ reply }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to send reply");
  }
  // backend returns { success, message, data: updatedSupportRequest }
  return data.data;
}

/**
 * Client: list my own support requests + replies
 */
export async function getMySupportRequests() {
  const res = await fetch(`${API_URL}/support/my`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to load your messages");
  }
  return data.data || [];
}
