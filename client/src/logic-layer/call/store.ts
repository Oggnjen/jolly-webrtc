import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface Member {
  identifier: string;
  nickname: string;
  peerConnection: RTCPeerConnection;
  mediaStream: MediaStream | undefined;
  position: 'large' | 'small' | 'hidden';
}

interface CallState {
  callIdentifier: string | null;
  setCallIdentifier: (identifier: string | null) => void;
  members: { [key: string]: Member };
  addMember: (id: string, name: string) => void;
  removeMember: (id: string) => void;
  clearMembers: () => void;
  changeMemberAsLarge: (id: string) => void;
  myStream: MediaStream | undefined;
  setMyMediaStream: (stream: MediaStream) => void;
}

const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export const callStore = create<CallState>()(
  immer((set, get) => ({
    callIdentifier: null,
    setCallIdentifier: (callIdentifier) => {
      set((state) => {
        state.callIdentifier = callIdentifier;
      });
    },
    members: {},
    addMember: (id, name) => {
      const peerConnection = new RTCPeerConnection(configuration);

      // peerConnection.addEventListener('track', async (event) => {
      //   const [remoteStream] = event.streams
      //   if (videoRef.current && remoteStream) setStream(remoteStream)
      // })

      const state = get();
      let position: 'small' | 'large' | 'hidden';

      if (Object.keys(state.members).length === 0) {
        position = 'large';
      } else if (Object.keys(state.members).length > 2) {
        position = 'hidden';
      } else {
        position = 'small';
      }

      const member: Member = {
        identifier: id,
        nickname: name,
        peerConnection,
        mediaStream: undefined,
        position,
      };

      const { myStream } = state;
      if (myStream) {
        myStream.getTracks().forEach((t) => peerConnection.addTrack(t, myStream));
      }

      set((state) => {
        state.members[id] = member;
      });
    },
    removeMember: (id: string) => {
      set((state) => {
        delete state.members[id];
      });
    },
    clearMembers: () => {
      set((state) => {
        state.members = {};
      });
    },
    changeMemberAsLarge: (id: string) => {
      const state = get();
      const largeMember = Object.values(state.members).find((m) => m.position == 'large');
      const oldPosition = state.members[id].position;
      set((state) => {
        state.members[id].position = 'large';
        if (largeMember) {
          state.members[largeMember.identifier].position = oldPosition;
        }
      });
    },
    myStream: undefined,
    setMyMediaStream: (stream: MediaStream) => {
      set((state) => {
        state.myStream = stream;
      });
    },
  }))
);
