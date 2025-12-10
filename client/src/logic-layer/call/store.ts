import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { dispatchMemberExitCall } from "../events/functions";

interface Member {
  identifier: string;
  nickname: string;
  peerConnection: RTCPeerConnection;
  mediaStream: MediaStream | undefined;
  position: "large" | "small" | "hidden";
}

interface Message {
  nickname: string;
  content: string;
}

interface CallState {
  callIdentifier: string | null;
  setCallIdentifier: (identifier: string | null) => void;
  messages: Message[];
  dataChannels: RTCDataChannel[];
  addDataChannel: (channel: RTCDataChannel) => void;
  addMessage: (message: Message) => void;
  members: { [key: string]: Member };
  addMember: (id: string, name: string) => void;
  removeMember: (id: string) => void;
  clearMembers: () => void;
  changeMemberAsLarge: (id: string) => void;
  myStream: MediaStream | null;
  setMyMediaStream: (stream: MediaStream | null) => void;
  updateVideoStreamForAllPeers: (stream: MediaStream) => void;
  stopVideoStreamForAllPeers: (imageUrl: string) => void;
  updateMyStream: (track: MediaStreamTrack) => void;
  toggleMicrophone: () => void;
}

const configuration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }, // fallback
    {
      urls: ["turn:157.90.241.190:3478"],
      username: import.meta.env.VITE_TURN_USERNAME,
      credential: import.meta.env.VITE_TURN_PASSWORD,
    },
  ],
  optional: [{ RtpDataChannels: true }],
};

export const callStore = create<CallState>()(
  immer((set, get) => ({
    callIdentifier: null,
    setCallIdentifier: (callIdentifier) => {
      set((state) => {
        state.callIdentifier = callIdentifier;
      });
    },
    messages: [],
    members: {},
    dataChannels: [],
    addDataChannel: (channel: RTCDataChannel) => {
      set((state) => {
        state.dataChannels.push(channel);
      });
    },
    addMessage: (message: Message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    },
    addMember: (id, name) => {
      const peerConnection = new RTCPeerConnection(configuration);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      peerConnection.onconnectionstatechange = (e) => {
        console.log("Changed peer state", e);
        if (peerConnection.connectionState == "disconnected") {
          dispatchMemberExitCall(id);
        }
      };

      // const dataChannel = peerConnection.createDataChannel('chat');
      // dataChannel.onopen = function (e) {
      //   console.log(e);
      //   set((state) => {
      //     if (e.target != null) state.dataChannels.push(e.target as RTCDataChannel);
      //   });
      // };
      // dataChannel.onerror = function (event) {
      //   console.error('DataChannel error:', event);
      // };
      // dataChannel.onmessage = function (e) {
      //   console.log('ETO ME');
      //   const message = e.data;
      //   set((state) => state.messages.push({ nickname: name, content: message }));
      // };

      const state = get();
      let position: "small" | "large" | "hidden";

      if (Object.keys(state.members).length === 0) {
        position = "large";
      } else if (Object.keys(state.members).length > 2) {
        position = "hidden";
      } else {
        position = "small";
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
        myStream
          .getTracks()
          .forEach((t) => peerConnection.addTrack(t, myStream));
      }

      set((state) => {
        state.members[id] = member;
      });
    },
    stopVideoStreamForAllPeers: (imageUrl: string) => {
      const state = get();
      const { members } = state;
      const img = new Image();
      img.src = imageUrl;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        if (ctx) ctx.drawImage(img, 0, 0);
      };
      const stream = canvas.captureStream();
      const videoTrack = stream.getVideoTracks()[0];
      set((state) => {
        Object.keys(members).forEach((m) => {
          state.members[m].peerConnection
            .getSenders()
            .find((s) => s.track?.kind === "video")
            ?.replaceTrack(videoTrack);
        });
      });
    },
    updateMyStream: (track: MediaStreamTrack) => {
      set((state) => {
        const oldTrack = state.myStream?.getVideoTracks()[0];
        if (oldTrack) {
          state.myStream?.removeTrack(oldTrack);
        }
        state.myStream?.addTrack(track);
      });
    },
    toggleMicrophone: () => {
      const state = get();
      const { members } = state;
      set((state) => {
        Object.keys(members).forEach((m) => {
          const track = state.members[m].peerConnection
            .getSenders()
            .find((s) => s.track?.kind === "audio");
          if (track && track.track) {
            track.track.enabled = !track.track.enabled;
            state.members[m].peerConnection
              .getSenders()
              .find((s) => s.track?.kind === "audio")
              ?.replaceTrack(track.track);
          }
        });
      });
    },
    updateVideoStreamForAllPeers: (stream: MediaStream) => {
      const state = get();
      const { members } = state;
      const [videoTrack] = stream.getVideoTracks();
      set((state) => {
        Object.keys(members).forEach((m) => {
          state.members[m].peerConnection
            .getSenders()
            .find((s) => s.track?.kind === "video")
            ?.replaceTrack(videoTrack);
        });
      });
    },
    removeMember: (id: string) => {
      set((state) => {
        const position = state.members[id].position;

        delete state.members[id];
        if (position == "large") {
          const smallMember = Object.values(state.members).find(
            (m) => m.position == "small"
          );
          if (smallMember) {
            smallMember.position = "large";
          }
        } else if (position == "small") {
          const smallMember = Object.values(state.members).find(
            (m) => m.position == "hidden"
          );
          if (smallMember) {
            smallMember.position = "small";
          }
        }
      });
    },
    clearMembers: () => {
      set((state) => {
        state.members = {};
      });
    },
    changeMemberAsLarge: (id: string) => {
      const state = get();
      const largeMember = Object.values(state.members).find(
        (m) => m.position == "large"
      );
      const oldPosition = state.members[id].position;
      set((state) => {
        state.members[id].position = "large";
        if (largeMember) {
          state.members[largeMember.identifier].position = oldPosition;
        }
      });
    },
    myStream: null,
    setMyMediaStream: (stream: MediaStream | null) => {
      set((state) => {
        state.myStream = stream;
      });
    },
  }))
);
