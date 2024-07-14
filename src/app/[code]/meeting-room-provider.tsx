'use client';

import React from 'react';
import { useArray, useMediaDevices } from 'react-pre-hooks';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { client, broadcastEvents } from '~/lib/supabase';
import Peer from 'simple-peer';

import { useSession } from '~/components/session-provider';
import type {
  User,
  MeetingUser,
  PresenceState,
  JoinResponsePayload,
  ConnectionRequestPayload,
  ConnectionResponsePayload,
} from '~/types';

type MeetingRoomContextData = {
  code: string;
  userMedia: ReturnType<typeof useMediaDevices>;
  constraintsRef: React.MutableRefObject<MediaStreamConstraints>;
  room: ReturnType<typeof useRoomChannel>;
  state: 'ready' | 'joining' | 'joined' | 'rejected' | 'error' | undefined;
  setState: React.Dispatch<React.SetStateAction<MeetingRoomContextData['state']>>;
};

export const MeetingRoomContext = React.createContext<MeetingRoomContextData>({} as any);

type MeetingRoomProviderProps = React.PropsWithChildren<{ code: string }>;

export function MeetingRoomProvider({ code, children }: MeetingRoomProviderProps) {
  const media = useMediaDevices();
  const [state, setState] = React.useState<MeetingRoomContextData['state']>();

  const constraintsRef = React.useRef<MediaStreamConstraints>({ audio: true, video: true });
  const firstMount = React.useRef(true);

  const room = useRoomChannel(code, media.stream, setState);

  React.useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;

      (async () => {
        try {
          await media.start(constraintsRef.current);
        } catch {
          try {
            constraintsRef.current = { audio: true };
            await media.start(constraintsRef.current);
          } catch {
            try {
              constraintsRef.current = { video: true };
              await media.start(constraintsRef.current);
            } catch (error) {
              console.warn(error);
            }
          }
        } finally {
          room.connectToChannel();
        }
      })();
    }

    return () => {
      media.stop();
      room.leaveChannel();
    };
  }, []);

  return (
    <MeetingRoomContext.Provider
      value={{
        code,
        userMedia: media,
        constraintsRef,
        room,
        state,
        setState,
      }}
    >
      {children}
    </MeetingRoomContext.Provider>
  );
}

export function useMeetingRoom() {
  return React.useContext(MeetingRoomContext);
}

function useRoomChannel(
  code: string,
  stream: MediaStream | null,
  updateUserState: MeetingRoomContextData['setState'],
) {
  const user = useSession().user!;
  const joinedUsers = useArray<MeetingUser>();
  const waitingUsers = useArray<MeetingUser>();

  const channelRef = React.useRef<RealtimeChannel>();
  const presenceKey = React.useRef('');

  const roomHost = React.useMemo(
    () => joinedUsers.array.find(({ info }) => info.roomCode === code)!,
    [code, joinedUsers.array],
  );

  const getPresenceState = React.useCallback(
    () => channelRef.current?.presenceState() as PresenceState,
    [],
  );

  const startTracking = React.useCallback(async () => {
    return channelRef.current?.track({ user } satisfies { user: User });
  }, [user]);

  const sendJoinResponse = React.useCallback((payload: JoinResponsePayload['payload']) => {
    return channelRef.current?.send({
      type: 'broadcast',
      event: broadcastEvents.JOIN_RESPONSE,
      payload,
    });
  }, []);

  const leaveChannel = React.useCallback(() => {
    if (!presenceKey.current || !channelRef.current) return;

    client.removeChannel(channelRef.current);
    presenceKey.current = '';
  }, [stream]);

  const connectToChannel = React.useCallback(() => {
    if (channelRef.current) return;

    const key = crypto.randomUUID();

    channelRef.current = client.channel(code, {
      config: {
        presence: { key },
        broadcast: { self: true },
      },
    });

    channelRef.current.on('presence', { event: 'sync' }, () => {
      console.log('state:', getPresenceState());
    });

    channelRef.current.on('presence', { event: 'join' }, ({ key, newPresences }) => {
      const newUser: User = newPresences[0]!.user;
    });

    channelRef.current.on('presence', { event: 'leave' }, ({ leftPresences }) => {
      const key: string = leftPresences[0]!.user.id;

      let userIndex = -1;
      joinedUsers.reset(arr => {
        userIndex = arr.findIndex(({ info }) => info.id === key);
        return arr;
      });

      if (userIndex !== -1) joinedUsers.pop(userIndex);

      console.log('leave:', { key, leftPresences });
    });

    channelRef.current.on(
      'broadcast',
      { event: broadcastEvents.JOIN_RESPONSE },
      ({ payload }: JoinResponsePayload) => {
        if (!payload) return;
        if (payload.key !== presenceKey.current) return;

        updateUserState('joined');

        console.log(streamRef.current);

        console.log('join:', { user, status: payload.status });
      },
    );

    channelRef.current.on(
      'broadcast',
      { event: broadcastEvents.CONNECTION_RESPONSE },
      (payload: ConnectionRequestPayload) => {},
    );

    channelRef.current.on(
      'broadcast',
      { event: broadcastEvents.CONNECTION_RESPONSE },
      (payload: ConnectionResponsePayload) => {},
    );

    channelRef.current.subscribe(async status => {
      console.log('status:', status);

      if (status !== 'SUBSCRIBED') return;

      updateUserState('ready');

      presenceKey.current = key;
    });
  }, [user]);

  const streamRef = React.useRef(stream);

  React.useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  return {
    channelRef,
    presenceKey,
    host: roomHost,
    joinedUsers: joinedUsers.array,
    getPresenceState,
    startTracking,
    sendJoinResponse,
    connectToChannel,
    leaveChannel,
  };
}
