import { useIdentifier } from "../user/hooks";
import { joinCall, makeNewCall } from "./service";
import { useCallStore } from "./store";

export function useCallIdentifier() {
  const { callIdentifier } = useCallStore();
  return callIdentifier;
}

export function useMembers() {
  const { members } = useCallStore();
  return members;
}

export function useMembersIdentifiers() {
  const { members } = useCallStore();
  return Object.keys(members);
}

export function useCreateCall() {
  const userIdentifer = useIdentifier();
  const { setCallIdentifier } = useCallStore();
  return () => {
    if (userIdentifer) {
      makeNewCall(userIdentifer).then((res) => {
        setCallIdentifier(res.data.identifier);
      });
    }
  };
}

export function useJoinCall() {
  const userIdentifer = useIdentifier();
  const { setCallIdentifier, addMember } = useCallStore();
  return (callIdentifier: string) => {
    if (userIdentifer) {
      joinCall(userIdentifer, callIdentifier).then((res) => {
        setCallIdentifier(res.data.identifier);
        res.data.members.forEach((m) => {
          addMember(m.identifier, m.nickname);
        });
      });
    }
  };
}
