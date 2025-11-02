import { useEffect, useRef, useState } from "react";
import { useMyStream } from "../media-context";
import { useCallIdentifier, useMembersIdentifiers } from "../logic-layer";
import { Button } from "./Button";
import {
  useMemberName,
  usePeerConnectionFromMember,
} from "../logic-layer/call/hooks";

export const CallRoom = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const myStream = useMyStream();
  const members = useMembersIdentifiers();
  const callIdentifier = useCallIdentifier();
  const [callIdentifierVisible, setCallIdentifierVisible] = useState(false);
  useEffect(() => {
    if (myStream && videoRef.current) {
      videoRef.current.srcObject = myStream;
    }
  }, [myStream]);
  useEffect(() => {
    
  }, [members])

  return (
    <div className="h-[95dvh]">
      <div className="flex gap-4">
        <div className="h-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="rounded-xl mb-4 min-w-[75dvw] max-h-[90dvh] mx-auto object-cover object-center shadow-2xl"
          />
        </div>
        <div className="flex flex-col justify-around w-full">
          {members.length == 0 && (
            <div className="bg-white p-4 rounded-xl shadow-2xl text-center w-full">
              <h2 className="font-semibold text-2xl">Invite someone</h2>
              <div className="mt-2">
                You can invite someone to the call in 3 steps:
              </div>
              <div className="text-left mx-auto w-[250px] mt-4">
                <div className="flex gap-4">
                  <span className="self-center">1. Click on the button</span>
                  <div className="rounded-full border-[0.5px] bg-white w-10 p-2 cursor-pointer self-center">
                    <img src="/icons/add-user.svg" alt="Add user" />
                  </div>
                </div>
                <div className="my-4">2. Copy the call id</div>
                <div className="">3. Send it to your friend</div>
              </div>
            </div>
          )}
          {members.map((m) => (
            <VisibleMember memberId={m} key={m} />
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <div
          className="rounded-full bg-white w-12 p-2 cursor-pointer relative"
          onClick={() => setCallIdentifierVisible(true)}
        >
          {callIdentifierVisible == true && (
            <div className="absolute bottom-15 -left-50 rounded-xl bg-white px-4 py-2 ">
              <div className="flex justify-end mb-2"></div>
              <div className="flex gap-4">
                <div className="text-nowrap self-center">{callIdentifier}</div>
                <div className="self-center">
                  <Button
                    onClick={async () => {
                      if (callIdentifier != null) {
                        await navigator.clipboard.writeText(callIdentifier);
                        setCallIdentifierVisible(false);
                      }
                    }}
                    text="Copy"
                  />
                </div>
                <div
                  className="rounded-full bg-red-300 w-8 p-1 cursor-pointer parent"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCallIdentifierVisible(false);
                  }}
                >
                  <img src="/icons/cross.svg" alt="Chat" />
                </div>
              </div>
            </div>
          )}
          <img src="/icons/add-user.svg" alt="Add user" />
        </div>
        <div className="rounded-full bg-blue-400 w-12 p-2 cursor-pointer">
          <img src="/icons/chat.svg" alt="Chat" />
        </div>
        <div className="rounded-full bg-blue-600 w-12 p-2 cursor-pointer">
          <img src="/icons/screen-share.svg" alt="Screen share" />
        </div>
        <div className="rounded-full bg-red-300 w-12 p-2 cursor-pointer">
          <img src="/icons/end-call.svg" alt="End call" />
        </div>
      </div>
    </div>
  );
};

function VisibleMember({ memberId }: { memberId: string }) {
  const peerConnection = usePeerConnectionFromMember(memberId);
  const name = useMemberName(memberId);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream>();
  useEffect(() => {
    if (!peerConnection) return;
    peerConnection.addEventListener("track", async (event) => {
      const [remoteStream] = event.streams;
      if (videoRef.current && remoteStream) setStream(remoteStream);
    });
  }, [peerConnection]);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);
  return (
    <div className="relative">
      <div className="absolute text-white bottom-5 left-4">{name}</div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-xl mb-4 min-w-[22dvw] h-[25dvh] mx-auto object-cover object-center shadow-2xl"
      />
      {stream == undefined && <>Loading...</>}
    </div>
  );
}
