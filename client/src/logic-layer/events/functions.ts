import { callStore } from '../call/store';
import { userStore } from '../user/store';
import { dispatchToSignalingServer } from '../websocket/functions';
import type { Data } from '../websocket/types';

export type ChangesInMemberEvent = CustomEvent<{ memberId: string }>;

export const dispatchSendOffer = (memberId: string) => {
  const event: ChangesInMemberEvent = new CustomEvent('send-offer', { detail: { memberId } });
  window.dispatchEvent(event);
};

function addTypedEventListener<T>(type: string, listener: (event: CustomEvent<T>) => void | Promise<void>) {
  window.addEventListener(type, listener as unknown as EventListener);
}

addTypedEventListener<{ memberId: string }>('send-offer', async (e) => {
  const { memberId } = e.detail;
  const { identifier } = userStore.getState();
  const { members } = callStore.getState();
  const peerConnection = members[memberId]?.peerConnection;
  if (identifier == null) return;
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  const data: Data = {
    RawData: JSON.stringify(offer),
    Recipient: memberId,
    Sender: identifier,
  };
  dispatchToSignalingServer(JSON.stringify(data));
});
