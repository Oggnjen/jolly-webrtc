import { axiosInstance } from '../../utils/axiosConfig';
import type { MemberDto } from '../user/service';

export function makeNewCall(memberIdentifier: string) {
  return axiosInstance.post<CallIdentifierDto>(`/calls?memberIdentifier=${memberIdentifier}`);
}

export function joinCall(memberIdentifier: string, callIdentifier: string) {
  return axiosInstance.post<JoinedCallDto>(
    `/calls/join?memberIdentifier=${memberIdentifier}&callIdentifier=${callIdentifier}`
  );
}

export function exitCall(memberIdentifier: string, callIdentifier: string) {
  return axiosInstance.post<JoinedCallDto>(
    `/calls/exit?memberIdentifier=${memberIdentifier}&callIdentifier=${callIdentifier}`
  );
}

export interface CallIdentifierDto {
  identifier: string;
}

export interface JoinedCallDto {
  identifier: string;
  members: MemberDto[];
}
