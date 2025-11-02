import { useEffect, useRef } from 'react';
import { useMyStream } from '../media-context';
import { useMembersIdentifiers } from '../logic-layer';

export const CallRoom = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const myStream = useMyStream();
  const members = useMembersIdentifiers();
  useEffect(() => {
    if (myStream && videoRef.current) {
      videoRef.current.srcObject = myStream;
    }
  }, [myStream]);
  return (
    <div className='h-dvh'>
      <div className='flex'>
        <div className='h-full'>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className='rounded-xl mb-4 min-w-[75dvw] max-h-[90dvh] mx-auto object-cover object-center'
          />
        </div>
        <div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
