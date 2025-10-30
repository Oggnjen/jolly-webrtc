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
    <div>
      {myStream == undefined && <div>I can't see you</div>}

      <video ref={videoRef} autoPlay playsInline muted className='rounded-xl mb-4' />
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
