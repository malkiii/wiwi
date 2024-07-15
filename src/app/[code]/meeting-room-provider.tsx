'use client';

import React from 'react';
import { useArray, useMediaDevices } from 'react-pre-hooks';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { client, broadcastEvents } from '~/lib/supabase';
import type Peer from 'simple-peer';

import { useSession } from '~/components/session-provider';
import type {
  User,
  MeetingUser,
  PresenceState,
  JoinResponsePayload,
  ConnectionRequestPayload,
  ConnectionResponsePayload,
  RequestSignals,
  PeerDataPayload,
  ConnectionSignal,
} from '~/types';
import { createPeerInstance } from '~/lib/utils';

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

  const constraintsRef = React.useRef<MediaStreamConstraints>({
    video: { facingMode: 'user' },
    audio: { noiseSuppression: true, echoCancellation: false },
  });
  const firstMount = React.useRef(true);

  const room = useRoomChannel(code, media.stream, setState);

  React.useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      const { video, audio } = constraintsRef.current;

      (async () => {
        try {
          await media.start(constraintsRef.current);
        } catch {
          try {
            constraintsRef.current = { audio };
            await media.start(constraintsRef.current);
          } catch {
            try {
              constraintsRef.current = { video };
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
  const peersRef = React.useRef<Record<string, Peer.Instance>>({});
  const hasJoined = React.useRef(false);
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

    stream?.getAudioTracks().forEach(track => track.stop());
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

    channelRef.current.on('presence', { event: 'leave' }, ({ key }) => {
      let userIndex = -1;
      joinedUsers.reset(arr => {
        userIndex = arr.findIndex(({ presenceKey }) => presenceKey === key);
        return arr;
      });

      if (userIndex === -1) return;

      joinedUsers.pop(userIndex);

      peersRef.current[key]?.destroy();
      delete peersRef.current[key];
    });

    channelRef.current.on(
      'broadcast',
      { event: broadcastEvents.JOIN_RESPONSE },
      async ({ payload }: JoinResponsePayload) => {
        if (!payload) return;
        if (payload.key !== presenceKey.current) return;

        if (payload.status === 'REJECTED') {
          return updateUserState('rejected');
        }

        console.log({ event: 'JOIN_RESPONSE', payload });

        updateUserState('joined');
        hasJoined.current = true;

        const signals = await createPeers();

        channelRef.current!.send({
          type: 'broadcast',
          event: broadcastEvents.CONNECTION_REQUEST,
          payload: {
            key: presenceKey.current,
            signals,
          } satisfies ConnectionRequestPayload['payload'],
        });
      },
    );

    channelRef.current.on(
      'broadcast',
      { event: broadcastEvents.CONNECTION_REQUEST },
      ({ payload }: ConnectionRequestPayload) => {
        if (!payload || !hasJoined.current) return;
        if (payload.key === presenceKey.current) return;

        console.log({ event: 'CONNECTION_REQUEST', payload });

        const singal = payload.signals[presenceKey.current];
        if (!singal) return;

        const peer = createPeerInstance(streamRef.current);

        peer.on('signal', signal => {
          channelRef.current!.send({
            type: 'broadcast',
            event: broadcastEvents.CONNECTION_RESPONSE,
            payload: {
              key: presenceKey.current,
              callerKey: payload.key,
              signal: { withStream: !!streamRef.current, data: signal },
            } satisfies ConnectionResponsePayload['payload'],
          });
        });

        addPeerEvents(payload.key, peer, singal);

        peer.signal(singal.data);
        peersRef.current[payload.key] = peer;
      },
    );

    channelRef.current.on(
      'broadcast',
      { event: broadcastEvents.CONNECTION_RESPONSE },
      ({ payload }: ConnectionResponsePayload) => {
        if (!payload) return;
        if (payload.callerKey !== presenceKey.current) return;

        console.log({ event: 'CONNECTION_RESPONSE', payload });

        const peer = peersRef.current[payload.key];
        if (!peer) return;

        addPeerEvents(payload.key, peer, payload.signal);

        peer.signal(payload.signal.data);
      },
    );

    channelRef.current.subscribe(async status => {
      if (status !== 'SUBSCRIBED') return;

      updateUserState('ready');

      presenceKey.current = key;
    });
  }, [user]);

  const createPeers = React.useCallback(
    () =>
      new Promise<RequestSignals>(resolve => {
        if (!channelRef.current) return;

        const presenceState = getPresenceState();
        let discount = Object.keys(presenceState).length - 1;

        if (discount === 0) return resolve({});

        const signals: RequestSignals = {};

        for (const key in presenceState) {
          if (presenceKey.current === key) continue;

          const peer = createPeerInstance(streamRef.current, true);

          peer.on('signal', signal => {
            signals[key] = { withStream: !!streamRef.current, data: signal };
            discount--;

            if (discount === 0) resolve(signals);
          });

          peersRef.current[key] = peer;
        }
      }),
    [],
  );

  const addPeerEvents = React.useCallback(
    (key: string, peer: Peer.Instance, signal: ConnectionSignal) => {
      const newUser = getPresenceState()[key]?.[0]?.user;
      if (!newUser) return;

      if (signal.withStream) {
        peer.on('stream', stream =>
          joinedUsers.push({
            presenceKey: key,
            info: newUser,
            stream,
          }),
        );
      } else {
        joinedUsers.push({
          presenceKey: key,
          info: newUser,
          stream: null,
        });
      }

      peer.on('data', (data: string) => {
        const payload: PeerDataPayload = JSON.parse(data);

        joinedUsers.reset(arr => {
          const stream = arr.find(({ presenceKey }) => presenceKey === key)?.stream;

          if (stream) {
            if ('video' in payload.state) {
              const track = stream.getVideoTracks()[0];
              if (track) track.enabled = payload.state.video!;
            }

            if ('audio' in payload.state) {
              const track = stream.getAudioTracks()[0];
              if (track) track.enabled = payload.state.audio!;
            }
          }

          return arr;
        });
      });
    },
    [],
  );

  const sendPeerData = React.useCallback((payload: PeerDataPayload) => {
    const peers = Object.values(peersRef.current);
    const data = JSON.stringify(payload);

    for (const peer of peers) peer.send(data);
  }, []);

  const streamRef = React.useRef(stream);
  React.useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  return {
    channelRef,
    presenceKey,
    joinedUsers: joinedUsers.array,
    host: roomHost,
    connectToChannel,
    leaveChannel,
    getPresenceState,
    startTracking,
    sendJoinResponse,
    sendPeerData,
  };
}
