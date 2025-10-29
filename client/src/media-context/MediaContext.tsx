import { createContext } from "react";

export interface MediaStoreContextState {
  stream: MediaStream | undefined;
  setStream: (stream: MediaStream | undefined) => void;
  videoStream: any | undefined;
  setVideoStream: (stream: any) => void;
  audioStream: any | undefined;
  setAudioStream: (stream: any) => void;
}

export function createMediaStoreContextStateDefaultValue(): MediaStoreContextState {
  return {
    setStream: () => {},
    stream: undefined,
    audioStream: {},
    setAudioStream: () => {},
    videoStream: {},
    setVideoStream: () => {},
  };
}

export const MediaStoreContext = createContext(
  createMediaStoreContextStateDefaultValue()
);
