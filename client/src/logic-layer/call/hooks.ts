import { dispatchSendOffer } from "../events/functions";
import { useIdentifier } from "../user/hooks";

import { joinCall, makeNewCall } from "./service";
import { callStore } from "./store";

export function useCallIdentifier() {
  const { callIdentifier } = callStore();
  return callIdentifier;
}

export function useMembers() {
  const { members } = callStore();
  return members;
}

export function useMembersIdentifiers() {
  const { members } = callStore();
  return Object.keys(members);
}

export function useCreateCall() {
  const userIdentifer = useIdentifier();
  const { setCallIdentifier } = callStore();
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
  const { setCallIdentifier, addMember } = callStore();
  return (callIdentifier: string) => {
    if (userIdentifer) {
      joinCall(userIdentifer, callIdentifier).then((res) => {
        setCallIdentifier(res.data.identifier);
        res.data.members.forEach((m) => {
          addMember(m.identifier, m.nickname);
          dispatchSendOffer(m.identifier, m.nickname);
        });
      });
    }
  };
}

export function useGetPeerConnectionFromMember() {
  const { members } = callStore();

  return (id: string) => {
    return members[id].peerConnection;
  };
}

export function usePeerConnectionFromMember(memberId: string) {
  const { members } = callStore();
  return members[memberId].peerConnection;
}

export function useMemberName(memberId: string) {
  const { members } = callStore();
  return members[memberId].nickname;
}
