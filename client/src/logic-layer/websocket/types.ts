export type SendToSignalingServerEvent = CustomEvent<{ payload: string }>;

export interface Data {
  Sender: string;
  Recipient: string;
  RawData: string;
  Type: DataType;
  SenderName?: string | null;
}

export enum DataType {
  SDP_OFFER = 'SDP_OFFER',
  SDP_ANSWER = 'SDP_ANSWER',
  ICE_CANDIDATE = 'ICE_CANDIDATE',
  EXITING_CALL = 'EXITING_CALL',
}
