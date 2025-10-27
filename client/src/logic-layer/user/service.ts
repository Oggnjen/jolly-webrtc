import { axiosInstance } from "../../utils/axiosConfig";

export function makeNewMember(nickname: string) {
  return axiosInstance.post<MemberDto>("/members", { nickname });
}

export interface MemberDto {
  nickname: string;
  identifier: string;
}
