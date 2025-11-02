import { callStore } from "../call/store";
import { userStore } from "../user/store";
import { dispatchToSignalingServer } from "../websocket/functions";
import { DataType, type Data } from "../websocket/types";

export type ChangesInMemberEvent = CustomEvent<{
  memberId: string;
  name: string;
}>;

export type GetDataEvent = CustomEvent<{
  memberId: string;
  payload: string;
  senderName?: string;
}>;

export const dispatchSendOffer = (memberId: string, name: string) => {
  const event: ChangesInMemberEvent = new CustomEvent("send-offer", {
    detail: { memberId, name },
  });
  window.dispatchEvent(event);
};

export const dispatchAcceptAnswer = (memberId: string, payload: string) => {
  const event: GetDataEvent = new CustomEvent("accept-answer", {
    detail: { memberId, payload },
  });
  window.dispatchEvent(event);
};

export const dispatchAcceptOfferAndSendAnswer = (
  memberId: string,
  payload: string,
  senderName: string
) => {
  const event: GetDataEvent = new CustomEvent("accept-offer-send-answer", {
    detail: { memberId, payload, senderName },
  });
  window.dispatchEvent(event);
};

export const dispatchAcceptIceCandidate = (
  memberId: string,
  payload: string
) => {
  const event: GetDataEvent = new CustomEvent("accept-ice", {
    detail: { memberId, payload },
  });
  window.dispatchEvent(event);
};

function addTypedEventListener<T>(
  type: string,
  listener: (event: CustomEvent<T>) => void | Promise<void>
) {
  window.addEventListener(type, listener as unknown as EventListener);
}

addTypedEventListener<{ memberId: string }>("send-offer", async (e) => {
  const { memberId } = e.detail;
  const { identifier, nickname } = userStore.getState();
  const { members } = callStore.getState();
  const peerConnection = members[memberId]?.peerConnection;
  if (identifier == null) return;
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  if (peerConnection != null)
    peerConnection.onicecandidate = (e) => {
      if (e.candidate) {
        const data: Data = {
          RawData: JSON.stringify(e.candidate),
          Type: DataType.ICE_CANDIDATE,
          Recipient: memberId,
          Sender: identifier,
        };
        dispatchToSignalingServer(JSON.stringify(data));
      }
    };
  const data: Data = {
    RawData: JSON.stringify(offer),
    Type: DataType.SDP_OFFER,
    Recipient: memberId,
    Sender: identifier,
    SenderName: nickname,
  };
  dispatchToSignalingServer(JSON.stringify(data));
});

addTypedEventListener<{
  memberId: string;
  payload: string;
  senderName: string;
}>("accept-offer-send-answer", async (e) => {
  const { memberId, senderName } = e.detail;
  const { payload } = e.detail;
  const { addMember } = callStore.getState();
  addMember(memberId, senderName);
  const { identifier, nickname } = userStore.getState();
  const { members } = callStore.getState();
  const peerConnection = members[memberId]?.peerConnection;
  if (identifier == null) return;
  if (peerConnection != null)
    peerConnection.onicecandidate = (e) => {
      if (e.candidate) {
        const data: Data = {
          RawData: JSON.stringify(e.candidate),
          Type: DataType.ICE_CANDIDATE,
          Recipient: memberId,
          Sender: identifier,
        };
        dispatchToSignalingServer(JSON.stringify(data));
      }
    };
  const offer = JSON.parse(payload) as RTCSessionDescriptionInit;
  await peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  const data: Data = {
    RawData: JSON.stringify(answer),
    Type: DataType.SDP_ANSWER,
    Recipient: memberId,
    Sender: identifier,
    SenderName: nickname,
  };
  dispatchToSignalingServer(JSON.stringify(data));
});

addTypedEventListener<{ memberId: string; payload: string }>(
  "accept-answer",
  async (e) => {
    const { memberId } = e.detail;
    const { payload } = e.detail;
    const { identifier } = userStore.getState();
    const { members } = callStore.getState();
    const peerConnection = members[memberId]?.peerConnection;
    if (identifier == null) return;
    if (peerConnection != null)
      peerConnection.onicecandidate = (e) => {
        if (e.candidate) {
          const data: Data = {
            RawData: JSON.stringify(e.candidate),
            Type: DataType.ICE_CANDIDATE,
            Recipient: memberId,
            Sender: identifier,
          };
          dispatchToSignalingServer(JSON.stringify(data));
        }
      };
    const answer = JSON.parse(payload) as RTCSessionDescriptionInit;
    await peerConnection.setRemoteDescription(answer);
  }
);

addTypedEventListener<{ memberId: string; payload: string }>(
  "accept-ice",
  async (e) => {
    console.log("EVO ME dodajem");
    const { memberId } = e.detail;
    const { payload } = e.detail;
    const { identifier } = userStore.getState();
    const { members } = callStore.getState();
    const peerConnection = members[memberId]?.peerConnection;
    if (identifier == null) return;
    if (peerConnection != null) {
      const ice = JSON.parse(payload) as RTCIceCandidateInit;
      await peerConnection.addIceCandidate(ice);
    }
  }
);
