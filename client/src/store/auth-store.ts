import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  token: string;
  name: string;
  role: string;
}

export interface UserStore {
  user: User | null;
  setUser: (userdata: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (userdata: User) => {
        const { id, token, name, role } = userdata;
        set({
          user: { id, token, name, role },
        });
      },
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-store",
    },
  ),
);
