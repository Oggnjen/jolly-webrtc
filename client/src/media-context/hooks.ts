import { useContext } from "react";
import { MediaStoreContext } from "./MediaContext";

export function useMyVideoStream() {
  const { videoStream } = useContext(MediaStoreContext);
  return videoStream;
}

export function useMyStream() {
  const { stream } = useContext(MediaStoreContext);
  return stream;
}

export function useSetMyStream() {
  const { setStream } = useContext(MediaStoreContext);
  return setStream;
}

export function useSetMyVideoStream() {
  const { setVideoStream } = useContext(MediaStoreContext);
  return setVideoStream;
}

export function useMyAudioStream() {
  const { audioStream } = useContext(MediaStoreContext);
  return audioStream;
}

export function useSetMyAudioStream() {
  const { setAudioStream } = useContext(MediaStoreContext);
  return setAudioStream;
}

export function useOpenMyCamera() {
  const constraints = {
    video: true,
    audio: true,
  };
  const { setStream } = useContext(MediaStoreContext);
  return () => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        setStream(stream);
        console.log("Got MediaStream:", stream.getVideoTracks());
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });
  };
}
