import { useShallow } from 'zustand/shallow';
import { dispatchSendOffer } from '../events/functions';
import { useIdentifier, useNickname } from '../user/hooks';

import { exitCall, joinCall, makeNewCall } from './service';
import { callStore } from './store';

export function useCallIdentifier() {
  const { callIdentifier } = callStore();
  return callIdentifier;
}

export function useMembers() {
  const { members } = callStore();
  return members;
}

export function useMembersIdentifiers() {
  const members = callStore(useShallow((state) => Object.keys(state.members)));
  return members;
}

export function useLargeMember() {
  const { members } = callStore();
  const membersValues = Object.values(members);
  if (membersValues.length == 0) {
    return undefined;
  }
  return membersValues.filter((m) => m.position === 'large')[0];
}

export function useSmallMembers() {
  const { members } = callStore();
  const membersValues = Object.values(members);
  return membersValues.filter((m) => m.position === 'small');
}

export function useHiddenMembers() {
  const { members } = callStore();
  const membersValues = Object.values(members);
  return membersValues.filter((m) => m.position === 'hidden');
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

export function useFocusMember() {
  const { changeMemberAsLarge } = callStore();
  return (id: string) => changeMemberAsLarge(id);
}

export function useToggleMicrophone() {
  const { toggleMicrophone } = callStore();

  return () => toggleMicrophone();
}

export function useMessages() {
  const { messages } = callStore();
  return messages;
}

export function useSendMessage() {
  const { addMessage, dataChannels } = callStore();
  const id = useIdentifier();
  const name = useNickname()[0];
  return (content: string) => {
    if (id != undefined && name != undefined) {
      addMessage({ content, nickname: name });
      dataChannels.forEach((d) => d.send(content));
    }
  };
}

export function useExitCall() {
  const userIdentifer = useIdentifier();
  const { callIdentifier } = callStore();
  return () => {
    if (userIdentifer && callIdentifier) {
      exitCall(userIdentifer, callIdentifier).then((res) => {
        if (res.status == 200) {
          window.location.reload();
        }
      });
    }
  };
}

export function useDisconnectMember() {
  const { callIdentifier, removeMember } = callStore();
  return (memberId: string) => {
    if (memberId && callIdentifier) {
      exitCall(memberId, callIdentifier).then((res) => {
        if (res.status == 200) {
          removeMember(memberId);
        }
      });
    }
  };
}
