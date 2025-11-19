import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authService from "../services/authService";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      // Initialize auth from localStorage
      // Note: Zustand persist middleware automatically restores state,
      // but this can be used to verify token validity if needed
      initializeAuth: () => {
        const token = authService.getToken();
        if (token) {
          // Verify token is still valid (basic check)
          // In a real app, you might want to verify with backend
          const userFromToken = authService.getCurrentUser();
          if (userFromToken && !useAuthStore.getState().user) {
            // Only set if user not already restored by persist
            set({ token, user: userFromToken });
          }
        }
      },

      // Login action
      login: async (email, password) => {
        try {
          const data = await authService.login(email, password);
          set({
            user: data.user,
            token: data.token,
          });
          return { success: true };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },

      // Logout action
      logout: () => {
        authService.logout();
        set({ user: null, token: null });
      },

      // Helper methods
      isAdmin: () => {
        const state = useAuthStore.getState();
        return state.user?.role === "ADMIN";
      },

      isUser: () => {
        const state = useAuthStore.getState();
        return state.user?.role === "CLIENT" || state.user?.role === "COACH" || state.user?.role === "CLINIC" || state.user?.role === "SUPPORT";
      },

      isGuest: () => {
        const state = useAuthStore.getState();
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

