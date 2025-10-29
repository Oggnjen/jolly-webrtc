import { useState, type ReactNode } from "react";
import { MediaStoreContext } from "./MediaContext";

interface MediaStoreProviderProps {
  children: ReactNode;
}

export function MediaStoreProvider({ children }: MediaStoreProviderProps) {
  const [videoStream, setVideoStream] = useState();
  const [audioStream, setAudioStream] = useState();
  const [stream, setStream] = useState<MediaStream>();
  return (
    <MediaStoreContext.Provider
      value={{
        audioStream,
        setAudioStream,
        setVideoStream,
        videoStream,
        stream,
        setStream,
      }}
    >
      {children}
    </MediaStoreContext.Provider>
  );
}
