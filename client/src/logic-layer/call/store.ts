import { create } from "zustand";

interface Member {
  identifier: string;
  nickname: string;
  peerConnection: RTCPeerConnection;
  mediaStream: MediaStream | undefined;
}

interface CallState {
  callIdentifier: string | null;
  setCallIdentifier: (identifier: string | null) => void;
  members: { [key: string]: Member };
  addMember: (id: string, name: string) => void;
  removeMember: (id: string) => void;
  clearMembers: () => void;
  myStream: MediaStream | undefined;
  setMyMediaStream: (stream: MediaStream) => void;
}

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const callStore = create<CallState>((set) => ({
  callIdentifier: null,
  setCallIdentifier: (callIdentifier) => {
    set({ callIdentifier });
  },
  members: {},
  addMember: (id, name) => {
    const peerConnection = new RTCPeerConnection(configuration);
    const member: Member = {
      identifier: id,
      nickname: name,
      peerConnection,
      mediaStream: undefined,
    };
    const { myStream } = callStore.getState();
    if (myStream)
      callStore
        .getState()
        .myStream?.getTracks()
        .forEach((t) => peerConnection.addTrack(t, myStream));

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
  myStream: undefined,
  setMyMediaStream: (stream: MediaStream) => set({ myStream: stream }),
}));
