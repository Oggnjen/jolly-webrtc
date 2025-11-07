import { useContext } from 'react';
import { MediaStoreContext } from './MediaContext';
import { callStore } from '../logic-layer/call/store';

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
  return (stream: MediaStream | undefined) => {
    setStream(stream);
  };
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
  const { setMyMediaStream } = callStore();
  return () => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        setStream(stream);
        if (stream) setMyMediaStream(stream);
      })
      .catch((error) => {
        console.error('Error accessing media devices.', error);
      });
  };
}
