import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authService from "../services/authService";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      // Initialize auth from localStorage / persisted state
      initializeAuth: () => {
        const token = authService.getToken();

        // If there's no token in storage, make sure we are logged out
        if (!token) {
          set({ user: null, token: null });
          return;
        }

        // If token exists but state.token is empty (fresh load), set it
        const state = get();
        if (!state.token) {
          set({ token });
        }
      },

      // Login action
      login: async (email, password) => {
        try {
          const data = await authService.login(email, password);
          set({
            user: data.user || null,
            token: data.token || null,
          });
          return { success: true };
        } catch (error) {
          console.error("Login error:", error);
          return { success: false, error: error.message };
        }
      },

      // Logout action
      logout: () => {
        authService.logout();
        set({ user: null, token: null });
      },

      // Helper methods (use `get()` instead of useAuthStore.getState)
      isAdmin: () => {
        const state = get();
        return state.user?.role === "ADMIN";
      },

      isUser: () => {
        const role = get().user?.role;
        return (
          role === "CLIENT" ||
          role === "COACH" ||
          role === "CLINIC" ||
          role === "SUPPORT"
        );
      },

      isGuest: () => {
        const state = get();
        return !state.user;
      },
    }),
    {
      name: "wfa-auth-storage",
      // Only persist token and user, not helper functions
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

export default useAuthStore;
