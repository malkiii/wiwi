import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
