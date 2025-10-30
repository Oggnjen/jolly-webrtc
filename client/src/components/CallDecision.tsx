import { useState } from 'react';
import { useCallIdentifier, useCreateCall, useJoinCall } from '../logic-layer';
import { Input } from './Input';
import { Button } from './Button';
import { MainCamera } from './MainCamera';

export const CallDecision = () => {
  const createCall = useCreateCall();
  const joinCall = useJoinCall();
  const id = useCallIdentifier();
  const [callIdentifier, setCallIdentifier] = useState('');
  return (
    <div>
      <MainCamera />
      <div className='bg-[#edfcff] p-4 rounded-xl shadow-2xl max-w-[400px] mx-auto'>
        <div className='text-center text-2xl font-semibold'>Join call or create one</div>
        <div className='flex justify-center mt-4 gap-4'>
          <Input value={callIdentifier} setValue={setCallIdentifier} />
          <Button text='Next' onClick={() => joinCall(callIdentifier)} />
        </div>
        <div className='flex justify-center mt-4'>
          <Button text='Create new call' onClick={() => createCall()} />
        </div>
        {id}
      </div>
    </div>
  );
};
