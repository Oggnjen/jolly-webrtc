import { useEffect, useRef, useState } from 'react';
import { useMyStream, useOpenMyCamera, useShareScreen, useStopSharingScreen } from '../media-context';
import { Button } from './Button';
import {
  useFocusMember,
  useHiddenMembers,
  useLargeMember,
  useMemberName,
  useMessages,
  usePeerConnectionFromMember,
  useSmallMembers,
  useToggleMicrophone,
  useCallIdentifier,
  useMembersIdentifiers,
  useSendMessage,
  useExitCall,
} from '../logic-layer';

export const CallRoom = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const myStream = useMyStream();
  const members = useMembersIdentifiers();
  const largeMember = useLargeMember();
  const smallMember = useSmallMembers();
  const hiddenMembers = useHiddenMembers();
  const callIdentifier = useCallIdentifier();
  const toggleMicrophone = useToggleMicrophone();
  const exitCall = useExitCall();
  const [callIdentifierVisible, setCallIdentifierVisible] = useState(false);
  const [otherMembersVisible, setOtherMembersVisible] = useState(false);
  const focusMember = useFocusMember();
  const shareScreen = useShareScreen();
  const stopSharing = useStopSharingScreen();
  const [isSharing, setIsSharing] = useState(false);
  const [isCamera, setIsCamera] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const openMyCamera = useOpenMyCamera();
  const messages = useMessages();
  const sendMessage = useSendMessage();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (myStream && videoRef.current) {
      videoRef.current.srcObject = myStream;
    }
  }, [myStream, members]);
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className='h-[95dvh]'>
      <div className='flex gap-4'>
        <div className='h-full'>
          {largeMember == undefined && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className='rounded-xl mb-4 min-w-[75dvw] max-h-[90dvh] mx-auto object-cover object-center shadow-2xl'
            />
          )}
          {largeMember != undefined && (
            <VisibleMember
              memberId={largeMember.identifier}
              key={largeMember.identifier}
              position={largeMember.position}
            />
          )}
        </div>
        <div className='flex flex-col justify-around w-full'>
          {members.length == 0 && (
            <div className='bg-white p-4 rounded-xl shadow-2xl text-center w-full'>
              <h2 className='font-semibold text-2xl'>Invite someone</h2>
              <div className='mt-2'>You can invite someone to the call in 3 steps:</div>
              <div className='text-left mx-auto w-[250px] mt-4'>
                <div className='flex gap-4'>
                  <span className='self-center'>1. Click on the button</span>
                  <div className='rounded-full border-[0.5px] bg-white w-10 p-2 cursor-pointer self-center'>
                    <img src='/icons/add-user.svg' alt='Add user' />
                  </div>
                </div>
                <div className='my-4'>2. Copy the call id</div>
                <div className=''>3. Send it to your friend</div>
              </div>
            </div>
          )}
          {members.length != 0 && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`
                rounded-xl mb-4 min-w-[22dvw] h-[25dvh] mx-auto object-cover object-center shadow-2xl`}
            />
          )}
          {smallMember.map((m) => (
            <VisibleMember memberId={m.identifier} key={m.identifier} position={m.position} />
          ))}
          {hiddenMembers.length != 0 && (
            <div className='w-full flex justify-end'>
              <div
                className='rounded-full bg-blue-400 w-12 p-2 cursor-pointer relative'
                onClick={() => setOtherMembersVisible(true)}
              >
                {otherMembersVisible == true && (
                  <div className='absolute bottom-15 -left-70 rounded-xl bg-white px-4 py-2 w-[300px]'>
                    <div className='flex justify-end mb-2 w-full'>
                      <div
                        className='rounded-full bg-red-300 w-8 p-1 cursor-pointer parent'
                        onClick={(e) => {
                          e.stopPropagation();
                          setOtherMembersVisible(false);
                        }}
                      >
                        <img src='/icons/cross.svg' alt='Chat' />
                      </div>
                    </div>
                    <div>
                      {hiddenMembers.map((m) => (
                        <div className='flex gap-4 justify-between'>
                          <div className='text-nowrap self-center'>{m.nickname}</div>
                          <div className='self-center'>
                            <Button
                              onClick={async () => {
                                focusMember(m.identifier);
                              }}
                              text='Focus'
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <img src='/icons/group.svg' alt='Other members' />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='flex justify-center gap-4'>
        <div
          className='rounded-full bg-white w-12 p-2 cursor-pointer relative'
          onClick={() => setCallIdentifierVisible(true)}
        >
          {callIdentifierVisible == true && (
            <div className='absolute bottom-15 -left-50 rounded-xl bg-white px-4 py-2 '>
              <div className='flex justify-end mb-2'></div>
              <div className='flex gap-4'>
                <div className='text-nowrap self-center'>{callIdentifier}</div>
                <div className='self-center'>
                  <Button
                    onClick={async () => {
                      if (callIdentifier != null) {
                        await navigator.clipboard.writeText(callIdentifier);
                        setCallIdentifierVisible(false);
                      }
                    }}
                    text='Copy'
                  />
                </div>
                <div
                  className='rounded-full bg-red-300 w-8 p-1 cursor-pointer parent'
                  onClick={(e) => {
                    e.stopPropagation();
                    setCallIdentifierVisible(false);
                  }}
                >
                  <img src='/icons/cross.svg' alt='cross' />
                </div>
              </div>
            </div>
          )}
          <img src='/icons/add-user.svg' alt='Add user' />
        </div>
        <div className='rounded-full bg-blue-400 w-12 p-2 cursor-pointer relative z-20'>
          <img src='/icons/chat.svg' alt='Chat' onClick={() => setIsChatOpen(!isChatOpen)} />
          {isChatOpen && (
            <div className='absolute bg-white p-4 w-[400px] h-[500px] bottom-20 -right-45 cursor-auto z-40'>
              <div className='overflow-y-scroll h-[400px]'>
                {messages.map((m) => (
                  <div className='flex mb-4'>
                    <div className='italic font-bold'>{m.nickname}:</div>
                    <div className=''>{m.content}</div>
                  </div>
                ))}
              </div>
              <div className='h-[50px] flex gap-4'>
                <input
                  type='text'
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  onKeyDown={handleKeyPress}
                  className='border-[0.5px] border-black rounded-lg w-full'
                />
                <Button
                  text='Send'
                  onClick={() => {
                    sendMessage(message);
                    setMessage('');
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div
          className='rounded-full bg-blue-600 w-12 p-2 cursor-pointer flex justify-center items-center'
          onClick={() => {
            toggleMicrophone();
            setIsMicrophoneOn(!isMicrophoneOn);
          }}
        >
          {isMicrophoneOn && <img src='/icons/mute.svg' alt='Unmute' />}
          {!isMicrophoneOn && <img src='/icons/unmute.svg' alt='Mute' />}
        </div>
        <div
          className='rounded-full bg-blue-600 w-12 p-2 cursor-pointer flex justify-center items-center'
          onClick={() => {
            if (!isCamera) {
              openMyCamera();
              setIsCamera(true);
            } else {
              stopSharing();
              setIsCamera(false);
            }
          }}
        >
          {!isCamera && <img src='/icons/video.svg' alt='Camera' />}
          {isCamera && <img src='/icons/stop-video.svg' alt='Stop camera' />}
        </div>
        <div
          className='rounded-full bg-blue-600 w-12 p-2 cursor-pointer flex justify-center items-center'
          onClick={() => {
            if (!isSharing) {
              shareScreen();
              setIsSharing(true);
            } else {
              stopSharing();
              setIsSharing(false);
            }
          }}
        >
          {!isSharing && <img src='/icons/screen-share.svg' alt='Screen share' />}
          {isSharing && <img src='/icons/stop-screen-share.svg' alt='Screen share' />}
        </div>
        <div className='rounded-full bg-red-300 w-12 p-2 cursor-pointer' onClick={() => exitCall()}>
          <img src='/icons/end-call.svg' alt='End call' />
        </div>
      </div>
    </div>
  );
};

function VisibleMember({ memberId, position }: { memberId: string; position: 'large' | 'small' | 'hidden' }) {
  const peerConnection = usePeerConnectionFromMember(memberId);
  const name = useMemberName(memberId);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream>();
  const focusMember = useFocusMember();
  useEffect(() => {
    if (!peerConnection) return;

    const receivers = peerConnection.getReceivers();
    const tracks = receivers.map((r) => r.track).filter(Boolean);

    setStream(new MediaStream(tracks));
  }, [peerConnection]);
  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);
  return (
    <div className='relative'>
      <div className='absolute text-white bottom-5 left-4'>{name}</div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`${
          position == 'small' &&
          'rounded-xl mb-4 min-w-[22dvw] h-[25dvh] mx-auto object-cover object-center shadow-2xl cursor-pointer'
        }
        ${
          position == 'large' &&
          'rounded-xl mb-4 min-w-[75dvw] max-h-[90dvh] mx-auto object-cover object-center shadow-2xl'
        }
        `}
        onClick={() => {
          if (position == 'small') {
            focusMember(memberId);
          }
        }}
      />
      {stream == undefined && <>Loading...</>}
    </div>
  );
}
