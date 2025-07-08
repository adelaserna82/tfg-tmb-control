import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role?: string;
  email?: string;
  name?: string;
  permission?: string[];
}

interface AuthState {
  token: string | null;
  user: string | null;
  role: string | null;
  email: string | null;
  isAuthenticated: boolean;
  permissions: string[];
  login: (token: string) => void;
  logout: () => void;
  hasPermission: (module: string, action: string) => boolean;
}
const APP_STATE = import.meta.env.VITE_API_USER_APP_STATE_NAME ?? "<sin key app state>";

const loadAuthState = (): Partial<AuthState> => {
  try {
    const stored = localStorage.getItem(APP_STATE);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error cargando el estado de autenticación:", error);
    return {};
  }
};

const saveAuthState = (state: Partial<AuthState>) => {
  try {
    localStorage.setItem(APP_STATE, JSON.stringify(state));
  } catch (error) {
    console.error("Error guardando el estado de autenticación:", error);
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  role: null,
  email: null,
  isAuthenticated: false,
  permissions: [],
  favoriteIndicators: [],
  ...loadAuthState(),

  login: (token) =>
    set((state) => {
      let decodedRole = null;
      let email = null;
      let user = null;
      let permissions: string[] = [];

      try {
        const decoded: DecodedToken = jwtDecode(token);
        decodedRole = decoded.role ?? null;
        email = decoded.email ?? null;
        user = decoded.name ?? null;

        if (Array.isArray((decoded as any).permission)) {
          permissions = (decoded as any).permission;
        } else if (typeof (decoded as any).permission === "string") {
          // solo un permiso
          permissions = [(decoded as any).permission];
        }

      } catch (error) {
        console.warn("Error decodificando JWT:", error);
      }

      const newState = {
        ...state,
        token,
        user,
        role: decodedRole,
        email,
        permissions,
        isAuthenticated: true,
      };

      saveAuthState(newState);
      return newState;
    }),

  logout: () =>
    set((state) => {
      const newState = {
        ...state,
        token: null,
        user: null,
        role: null,
        email: null,
        isAuthenticated: false,
        favoriteIndicators: [],
      };
      saveAuthState(newState);
      return newState;
    }),
  hasPermission: (module: string, action: string): boolean =>
    useAuthStore.getState().permissions.includes(`${module}:${action}`),

}));