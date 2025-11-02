import { useEffect, useRef } from 'react';
import { useMyStream, useOpenMyCamera } from '../media-context';
import { Button } from './Button';
import { useMembersIdentifiers } from '../logic-layer';

export const MainCamera = () => {
  const openMyCamera = useOpenMyCamera();
  const videoRef = useRef<HTMLVideoElement>(null);
  const myStream = useMyStream();
  const members = useMembersIdentifiers();
  useEffect(() => {
    if (myStream && videoRef.current) {
      videoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  return (
    <div className=''>
      {myStream == undefined && (
        <div className='h-[480px] w-[680px] rounded-xl bg-white shadow-2xl flex justify-center items-center-safe mx-auto'>
          I can't see you
        </div>
      )}

      {myStream != undefined && (
        <video ref={videoRef} autoPlay playsInline muted className='rounded-xl mb-4 max-h-[480px] mx-auto' />
      )}
      {myStream == undefined && members.length == 0 && (
        <div className='flex justify-center my-2'>
          <Button
            text='Open a camera'
            onClick={() => {
              openMyCamera();
            }}
          />
        </div>
      )}
    </div>
  );
};
