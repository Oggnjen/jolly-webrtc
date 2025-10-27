import { useEffect } from "react";
import { create } from "zustand";

interface UserState {
  nickname: string | null;
  setNickname: (nickname: string | null) => void;
  identifier: string | null;
  setIdentifier: (identifier: string | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  nickname: null,
  setNickname: (nickname) => {
    set({ nickname });
    if (nickname) {
      localStorage.setItem("nickname", nickname);
    } else {
      localStorage.removeItem("nickname");
    }
  },
  identifier: null,
  setIdentifier: (identifier) => set({ identifier }),
}));

export function useInitializeUserStore() {
  const setNickname = useUserStore((state) => state.setNickname);

  useEffect(() => {
    const savedUser = localStorage.getItem("nickname");
    if (savedUser) {
      setNickname(savedUser);
    }
  }, [setNickname]);
}
