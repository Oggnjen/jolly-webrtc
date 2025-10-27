import { Input } from "./Input";
import { Button } from "./Button";
import { useIdentifier, useMakeMember, useNickname } from "../logic-layer";

export const UserInfo = () => {
  const [nickname, setNickname] = useNickname();
  const identifier = useIdentifier();
  const makeMember = useMakeMember();
  return (
    <div className="bg-[#edfcff] p-4 rounded-xl shadow-2xl">
      <div className="text-center text-2xl font-semibold">
        Enter your nickname
      </div>
      <div className="flex justify-center mt-4 gap-4">
        <Input value={nickname} setValue={setNickname} />
        <Button text="Next" onClick={() => makeMember()} />
        {identifier}
      </div>
    </div>
  );
};
