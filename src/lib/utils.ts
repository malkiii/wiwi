import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Peer from 'simple-peer';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserAvatarFallback(name: string) {
  const [firstName, lastName] = name.split(/\s+/);
  if (!firstName) return '';

  if (lastName) {
    return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
  }

  return firstName.slice(0, 2).toUpperCase();
}

export function extractMeetingCode(str: string) {
  const resolvedCode = str.match(/([\w\.-]+\/)?(\d{3}(-?)\d{3}\3\d{3}\s*$)/i)?.[2];

  return resolvedCode?.replace(/(\d{3})(\d{3})(\d{3})/i, '$1-$2-$3');
}

export function getMediaTracks(stream: MediaStream | null) {
  return {
    video: stream?.getVideoTracks()[0],
    audio: stream?.getAudioTracks()[0],
  };
}

export function createPeerInstance(stream: MediaStream | null, initiator = false) {
  return new Peer({
    initiator,
    trickle: false,
    stream: stream ?? undefined,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
        {
          urls: 'turn:turn.bistri.com:80',
          credential: 'homeo',
          username: 'homeo',
        },
        {
          urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
          credential: 'webrtc',
          username: 'webrtc',
        },
      ],
    },
  });
}
