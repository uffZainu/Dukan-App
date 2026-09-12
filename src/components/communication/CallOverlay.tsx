import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  SwitchCamera,
  Volume2,
  VolumeX,
  ShieldCheck,
  Radio
} from 'lucide-react';

export const CallOverlay: React.FC = () => {
  const { activeCall, endCall, toggleMuteCall, toggleVideoCall } = useApp();

  const [callDuration, setCallDuration] = useState(0);
  const [callState, setCallState] = useState<'ringing' | 'connected'>('ringing');
  const [hasCameraStream, setHasCameraStream] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Ringing to Connected transition
  useEffect(() => {
    if (!activeCall) return;

    setCallState('ringing');
    setCallDuration(0);

    const timer = setTimeout(() => {
      setCallState('connected');
    }, 2200);

    return () => clearTimeout(timer);
  }, [activeCall?.id]);

  // Duration Timer
  useEffect(() => {
    if (callState !== 'connected') return;

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [callState]);

  // MediaStream camera access for video call
  useEffect(() => {
    if (!activeCall || activeCall.type !== 'video' || activeCall.isVideoOff) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setHasCameraStream(false);
      return;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasCameraStream(true);
        })
        .catch(() => {
          // Graceful fallback if camera permission not granted in iframe
          setHasCameraStream(false);
        });
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [activeCall?.type, activeCall?.isVideoOff]);

  if (!activeCall) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 z-50 bg-neutral-950 flex flex-col justify-between p-6 animate-in fade-in duration-300">
      {/* Background Video stream or ambient glow */}
      {activeCall.type === 'video' && !activeCall.isVideoOff ? (
        <div className="absolute inset-0 overflow-hidden z-0">
          {hasCameraStream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full relative">
              <img
                src={activeCall.shopLogo}
                alt={activeCall.shopName}
                className="w-full h-full object-cover filter blur-md opacity-40 scale-105"
              />
              <div className="absolute inset-0 bg-neutral-950/70"></div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/80"></div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-radial from-amber-500/10 via-neutral-950 to-neutral-950"></div>
      )}

      {/* Top Banner: Privacy Protection */}
      <div className="relative z-10 flex flex-col items-center space-y-2">
        <div className="bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-700/60 flex items-center gap-1.5 text-[10px] text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Encrypted In-App Voice & Video • SIM Number Hidden</span>
        </div>

        <div className="text-center pt-2">
          <h2 className="text-lg font-bold text-white drop-shadow-md">{activeCall.shopName}</h2>
          <span className="text-xs text-neutral-300 font-medium">
            {callState === 'ringing' ? (
              <span className="animate-pulse text-amber-400">Ringing store counter...</span>
            ) : (
              <span className="font-mono text-emerald-400 font-bold">{formatTimer(callDuration)}</span>
            )}
          </span>
        </div>
      </div>

      {/* Center Visualizer / Store Avatar */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        <div className="relative">
          {/* Animated sound ripple circles */}
          {callState === 'connected' && !activeCall.isMuted && (
            <>
              <div className="absolute -inset-4 rounded-full border border-amber-500/30 animate-ping opacity-60"></div>
              <div className="absolute -inset-8 rounded-full border border-amber-500/20 animate-pulse opacity-40"></div>
            </>
          )}

          <img
            src={activeCall.shopLogo}
            alt={activeCall.shopName}
            className="w-32 h-32 rounded-3xl object-cover border-4 border-neutral-800 shadow-2xl relative z-10"
          />

          {callState === 'connected' && (
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center font-bold z-20 shadow">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
          )}
        </div>

        <div className="text-center mt-4">
          <span className="text-xs text-neutral-400 block">
            {activeCall.type === 'video' ? 'Store Front Video Inspection' : 'Direct Audio Bridge'}
          </span>
          <span className="text-[11px] text-neutral-500">Zero Cellular Call Charges</span>
        </div>
      </div>

      {/* Bottom Calling Action Bar */}
      <div className="relative z-10 flex flex-col items-center space-y-4">
        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          {/* Mute Toggle */}
          <button
            id="call-btn-mute"
            onClick={toggleMuteCall}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition shadow-lg ${
              activeCall.isMuted
                ? 'bg-rose-500 text-white'
                : 'bg-neutral-800/90 text-neutral-200 hover:bg-neutral-700'
            }`}
            title={activeCall.isMuted ? 'Unmute' : 'Mute'}
          >
            {activeCall.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Video Toggle (if video call) */}
          {activeCall.type === 'video' && (
            <button
              id="call-btn-video-toggle"
              onClick={toggleVideoCall}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition shadow-lg ${
                activeCall.isVideoOff
                  ? 'bg-rose-500 text-white'
                  : 'bg-neutral-800/90 text-neutral-200 hover:bg-neutral-700'
              }`}
              title={activeCall.isVideoOff ? 'Enable Camera' : 'Turn Off Camera'}
            >
              {activeCall.isVideoOff ? (
                <VideoOff className="w-6 h-6" />
              ) : (
                <VideoIcon className="w-6 h-6" />
              )}
            </button>
          )}

          {/* End Call Button */}
          <button
            id="call-btn-end"
            onClick={endCall}
            className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition shadow-2xl active:scale-95"
            title="End Call"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
        </div>

        <p className="text-[10px] text-neutral-500 text-center">
          Tap End Call when finished. Call logs are securely saved for dispute moderation.
        </p>
      </div>
    </div>
  );
};
