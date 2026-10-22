import { create } from "zustand";

export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

type AuthState = {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    fetchUser: () => Promise<void>;
    clearError: () => void;
};

async function authRequest(
    url: string,
    payload: Record<string, string>
): Promise<{ ok: boolean; data: { message?: string; token?: string; user?: User } }> {
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await response.json();
    return { ok: response.ok, data };
}

export const userStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: false,
    isInitialized: false,
    error: null,

    clearError: () => set({ error: null }),

    register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { ok, data } = await authRequest("/api/auth/register", { name, email, password });

            if (!ok || !data.token || !data.user) {
                set({ error: data.message ?? "Failed to register" });
                return false;
            }

            localStorage.setItem("token", data.token);
            set({ user: data.user, token: data.token, isInitialized: true });
            return true;
        } catch {
            set({ error: "Server error" });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { ok, data } = await authRequest("/api/auth/login", { email, password });

            if (!ok || !data.token || !data.user) {
                set({ error: data.message ?? "Failed to login" });
                return false;
            }

            localStorage.setItem("token", data.token);
            set({ user: data.user, token: data.token, isInitialized: true });
            return true;
        } catch {
            set({ error: "Server error" });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null, error: null });
    },

    fetchUser: async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            set({ user: null, token: null, isInitialized: true });
            return;
        }

        set({ isLoading: true, token, error: null });

        try {
            const response = await fetch("/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    set({ user: null, token: null });
                }
                return;
            }

            const data = await response.json();
            set({ user: data.user, token });
        } catch {
            set({ user: null });
        } finally {
            set({ isLoading: false, isInitialized: true });
        }
    },
}));