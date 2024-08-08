'use client';

import { createContext, useContext, useEffect, useRef } from 'react';

type SoundsContextData = {
  playJoinSound: () => void;
  playLeaveSound: () => void;
  playNotificationSound: () => void;
};

export const SoundsContext = createContext<SoundsContextData>({} as any);

export function SoundsProvider({ children }: React.PropsWithChildren) {
  const joinSound = useRef<HTMLAudioElement>();
  const leaveSound = useRef<HTMLAudioElement>();
  const notificationSound = useRef<HTMLAudioElement>();

  useEffect(() => {
    joinSound.current = new Audio('/assets/sounds/join.wav');
    leaveSound.current = new Audio('/assets/sounds/leave.wav');
    notificationSound.current = new Audio('/assets/sounds/notification.wav');
  }, []);

  return (
    <SoundsContext.Provider
      value={{
        playJoinSound: () => joinSound.current?.play(),
        playLeaveSound: () => leaveSound.current?.play(),
        playNotificationSound: () => notificationSound.current?.play(),
      }}
    >
      {children}
    </SoundsContext.Provider>
  );
}

export function useSounds() {
  return useContext(SoundsContext);
}
