import { useEffect, useState } from "react";
import {
  useCallIdentifier,
  useCreateCall,
  useJoinCall,
  useMembers,
} from "../logic-layer";
import { Input } from "./Input";
import { Button } from "./Button";
import { useOpenMyCamera } from "../media-context";

export const CallDecision = () => {
  const createCall = useCreateCall();
  const joinCall = useJoinCall();
  const id = useCallIdentifier();
  const [callIdentifier, setCallIdentifier] = useState("");
  const members = useMembers();
  useEffect(() => {
    console.log(members);
  }, [members]);
  return (
    <div className="bg-[#edfcff] p-4 rounded-xl shadow-2xl">
      <div className="text-center text-2xl font-semibold">
        Join call or create one
      </div>
      <div className="flex justify-center mt-4 gap-4">
        <Input value={callIdentifier} setValue={setCallIdentifier} />
        <Button text="Next" onClick={() => joinCall(callIdentifier)} />
      </div>
      <div onClick={() => createCall()}>Create new one</div>
      {id}
    </div>
  );
};
