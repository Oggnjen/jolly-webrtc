import { makeNewMember } from './service';
import { userStore } from './store';

export function useNickname(): [string | null, (val: string) => void] {
  const { nickname, setNickname } = userStore();

  return [nickname, (val: string) => setNickname(val)];
}

export function useIdentifier(): string | null {
  const { identifier } = userStore();

  return identifier;
}

export function useMakeMember() {
  const { nickname, setIdentifier } = userStore();

  return () => {
    if (nickname)
      makeNewMember(nickname).then((res) => {
        setIdentifier(res.data.identifier);
      });
  };
}
