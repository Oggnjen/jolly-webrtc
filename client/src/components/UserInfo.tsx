import { Input } from './Input';
import { Button } from './Button';
import { useMakeMember, useNickname } from '../logic-layer';
import { MainCamera } from './MainCamera';

export const UserInfo = () => {
  const [nickname, setNickname] = useNickname();
  const makeMember = useMakeMember();
  return (
    <div>
      <MainCamera />
      <div className='bg-[#edfcff] p-4 rounded-xl shadow-2xl max-w-[400px] mx-auto'>
        <div className='text-center text-2xl font-semibold'>Enter your nickname</div>
        <div className='flex justify-center mt-4 gap-4'>
          <Input value={nickname} setValue={setNickname} />
          <Button text='Next' onClick={() => makeMember()} />
        </div>
      </div>
    </div>
  );
};
