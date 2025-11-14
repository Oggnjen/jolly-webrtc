import { useContext } from 'react';
import { MediaStoreContext } from './MediaContext';
import { callStore } from '../logic-layer/call/store';
import { useNickname } from '../logic-layer';
import { generateImageFromString } from '../utils/functions';

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
  const { setMyMediaStream, updateVideoStreamForAllPeers } = callStore();
  return () => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        setStream(stream);
        if (stream) setMyMediaStream(stream);
        updateVideoStreamForAllPeers(stream);
      })
      .catch((error) => {
        console.error('Error accessing media devices.', error);
      });
  };
}

export function useStopSharingScreen() {
  const { updateMyStream, stopVideoStreamForAllPeers } = callStore();
  const nickname = useNickname()[0];
  return () => {
    const imageUrl = generateImageFromString(nickname || '');
    const img = new Image();
    img.src = imageUrl;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) ctx.drawImage(img, 0, 0);
    };
    const stream = canvas.captureStream();
    const videoTrack = stream.getVideoTracks()[0];
    updateMyStream(videoTrack);
    stopVideoStreamForAllPeers(imageUrl);
  };
}

export function useShareScreen() {
  const constraints = {
    video: {
      displaySurface: 'browser',
    },
    audio: true,
    preferCurrentTab: false,
    selfBrowserSurface: 'exclude',
    systemAudio: 'include',
    surfaceSwitching: 'include',
    monitorTypeSurfaces: 'include',
  };
  const { setStream } = useContext(MediaStoreContext);
  const { setMyMediaStream, updateVideoStreamForAllPeers } = callStore();
  return () => {
    navigator.mediaDevices
      .getDisplayMedia(constraints)
      .then((stream) => {
        setStream(stream);
        if (stream) setMyMediaStream(stream);
        updateVideoStreamForAllPeers(stream);
      })
      .catch((error) => {
        console.error('Error accessing media devices.', error);
      });
  };
}
