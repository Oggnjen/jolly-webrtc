export type SendToSignalingServerEvent = CustomEvent<{ payload: string }>;

export interface Data {
  Sender: string;
  Recipient: string;
  RawData: string;
}
