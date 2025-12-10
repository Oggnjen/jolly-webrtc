import type { SendToSignalingServerEvent } from './types';

export const dispatchToSignalingServer = (payload: string) => {
  const event: SendToSignalingServerEvent = new CustomEvent('send-to-signaling-server', { detail: { payload } });
  window.dispatchEvent(event);
};
