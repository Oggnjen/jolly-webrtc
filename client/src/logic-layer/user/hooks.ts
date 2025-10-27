import { makeNewMember } from "./service";
import { useUserStore } from "./store";

export function useNickname(): [string | null, (val: string) => void] {
  const { nickname, setNickname } = useUserStore();

  return [nickname, (val: string) => setNickname(val)];
}

export function useIdentifier(): string | null {
  const { identifier } = useUserStore();

  return identifier;
}

export function useMakeMember() {
  const { nickname, setIdentifier } = useUserStore();

  return () => {
    if (nickname)
      makeNewMember(nickname).then((res) => {
        setIdentifier(res.data.identifier);
      });
  };
}
