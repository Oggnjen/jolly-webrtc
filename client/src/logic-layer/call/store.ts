import { create } from 'zustand';

interface Member {
  identifier: string;
  nickname: string;
  peerConnection: RTCPeerConnection;
}

interface CallState {
  callIdentifier: string | null;
  setCallIdentifier: (identifier: string | null) => void;
  members: { [key: string]: Member };
  addMember: (id: string, name: string) => void;
  removeMember: (id: string) => void;
  clearMembers: () => void;
}

const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export const callStore = create<CallState>((set) => ({
  callIdentifier: null,
  setCallIdentifier: (callIdentifier) => {
    set({ callIdentifier });
  },
  members: {},
  addMember: (id, name) => {
    const member: Member = {
      identifier: id,
      nickname: name,
      peerConnection: new RTCPeerConnection(configuration),
    };
    set((state) => ({ members: { ...state.members, [id]: member } }));
  },
  removeMember: (id: string) => {
    set((state) => {
      const { [id]: _, ...rest } = state.members;
      return { members: rest };
    });
  },
  clearMembers: () => {
    set({ members: {} });
  },
}));
