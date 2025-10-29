import React, { useEffect, useRef } from "react";
import {
  useMyStream,
  useMyVideoStream,
  useOpenMyCamera,
} from "../media-context";
import { Button } from "./Button";

export const MainCamera = () => {
  const openMyCamera = useOpenMyCamera();
  const videoRef = useRef<HTMLVideoElement>(null);
  const myStream = useMyStream();
  useEffect(() => {
    console.log(myStream);
    if (myStream && videoRef.current) {
      videoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  return (
    <div>
      {myStream == undefined && <div>I can't see you</div>}
      <video ref={videoRef} autoPlay playsInline muted />
      <div>
        <Button
          text="Open a camera"
          onClick={() => {
            openMyCamera();
          }}
        />
      </div>
    </div>
  );
};
