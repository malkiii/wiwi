'use client';

import React from 'react';
import { useArray, useMediaDevices } from 'react-pre-hooks';
import type { RealtimeChannel, RealtimePresenceState } from '@supabase/supabase-js';
import { client, broadcastEvents } from '~/lib/supabase';
import type Peer from 'simple-peer';

import { toast } from '~/components/ui/sonner';
import { useSession } from '~/components/session-provider';
import { createPeerInstance, getMediaTracks } from '~/lib/utils';

import type {
  MeetingUser,
  PresenceStateValue,
  JoinResponsePayload,
  ConnectionRequestPayload,
  ConnectionResponsePayload,
  RequestSignals,
  ConnectionSignal,
  ChatMessage,
  ChatMessagePayload,
  LeaveEventPayload,
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

  const room = useRoomChannel(code, media.stream, setState);

  const constraintsRef = React.useRef<MediaStreamConstraints>({
    video: { facingMode: 'user' },
    audio: { noiseSuppression: true, echoCancellation: false },
  });

  const firstMount = React.useRef(true);
  React.useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      const { video, audio } = constraintsRef.current;

      const startUserMedia = () => media.start(constraintsRef.current);

      (async () => {
        try {
          await startUserMedia();
        } catch {
          try {
            constraintsRef.current = { audio };
            await startUserMedia();
          } catch {
            try {
              constraintsRef.current = { video };
              await startUserMedia();
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
      room.leaveChannel();
      media.stop();
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
  const chatMessages = useArray<ChatMessage>();

  const participantsRef = React.useRef<string[]>([]);

  const channelRef = React.useRef<RealtimeChannel>();
  const peersRef = React.useRef<Record<string, Peer.Instance>>({});
  const hasJoined = React.useRef(false);
  const presenceKey = React.useRef('');
  const hostKey = React.useRef<string>();

  const roomHost = React.useMemo(() => {
    const host = joinedUsers.array.find(({ info }) => info.roomCode === code);
    hostKey.current = host?.presenceKey;

    return host;
  }, [code, joinedUsers.array]);

  const getPresenceState = React.useCallback(
    () => channelRef.current?.presenceState() as RealtimePresenceState<PresenceStateValue>,
    [],
  );

  const track = React.useCallback(async () => {
    if (!channelRef.current) return;

    const tracks = getMediaTracks(streamRef.current);
    const state = {
      video: !!tracks.video?.enabled,
      audio: !!tracks.audio?.enabled,
    };

    return channelRef.current?.track({ user, state } satisfies PresenceStateValue);
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

    // destroy all peer connections
    const peers = Object.values(peersRef.current);
    for (const peer of peers) peer.destroy();

    // leave the channel
    client.removeChannel(channelRef.current);
    presenceKey.current = '';
  }, [stream]);

  const hangUp = React.useCallback(async () => {
    if (!channelRef.current) return;

    await channelRef.current.send({
      type: 'broadcast',
      event: broadcastEvents.LEAVE,
      payload: {
        key: presenceKey.current,
        name: user.name,
      } satisfies LeaveEventPayload['payload'],
    });
  }, []);

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

    channelRef.current.on('presence', { event: 'join' }, async ({ key, newPresences }) => {
      if (presenceKey.current === key) return;
      if (!hasJoined.current) return;

      const presence: PresenceStateValue = newPresences[0]! as any;
      let partner: MeetingUser | undefined;

      joinedUsers.reset(arr => {
        partner = arr.find(({ presenceKey }) => presenceKey === key);
        return arr;
      });

      if (partner) {
        const tracks = getMediaTracks(partner.stream);

        if (tracks.video) tracks.video.enabled = presence.state.video;
        if (tracks.audio) tracks.audio.enabled = presence.state.audio;
        return;
      }

      if (presence.user.roomCode === code) return;

      const isHost = user.roomCode === code;
      const isAlreadyJoined = participantsRef.current.includes(key);

      if ((isHost || (!isHost && !hostKey.current)) && isAlreadyJoined) {
        await sendJoinResponse({ key, status: 'ACCEPTED' });
      } else if (isHost) {
        waitingUsers.push({ presenceKey: key, info: presence.user, stream: null });

        toast(`${presence.user.name} wants to join!`, {
          action: {
            label: 'Accept',
            onClick: async () => {
              const existingUser = removeWaitingUser(key);
              if (!existingUser) return;

              await sendJoinResponse({ key, status: 'ACCEPTED' });
            },
          },
        });
      }
    });

    channelRef.current.on('presence', { event: 'leave' }, ({ key }) => {
      if (key === presenceKey.current) return;
      if (hasJoined.current) return;

      removeWaitingUser(key);
    });

    const removeWaitingUser = (key: string) => {
      let userIndex = -1;
      waitingUsers.reset(arr => {
        userIndex = arr.findIndex(({ presenceKey }) => presenceKey === key);
        return arr;
      });

      if (userIndex === -1) return;

      return waitingUsers.pop(userIndex);
    };

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

        if (hasJoined.current) return;

        hasJoined.current = true;
        const signals = await createPeerSignals();

        channelRef.current!.send({
          type: 'broadcast',
          event: broadcastEvents.CONNECTION_REQUEST,
          payload: {
            key: presenceKey.current,
            signals,
          } satisfies ConnectionRequestPayload['payload'],
        });

        updateUserState('joined');
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

        addPeerEvents(payload.key, peer, singal, false);

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

        addPeerEvents(payload.key, peer, payload.signal, true);

        peer.signal(payload.signal.data);
      },
    );

    channelRef.current.on(
      'broadcast',
      { event: broadcastEvents.LEAVE },
      ({ payload }: LeaveEventPayload) => {
        if (!payload) return;

        const userIndex = participantsRef.current.indexOf(payload.key);
        if (userIndex === -1) return;

        participantsRef.current.splice(userIndex, 1);
      },
    );

    channelRef.current.subscribe(async status => {
      if (status !== 'SUBSCRIBED') return;

      updateUserState('ready');

      presenceKey.current = key;
    });
  }, [user]);

  const createPeerSignals = React.useCallback(
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
    (key: string, peer: Peer.Instance, signal: ConnectionSignal, isInitiator: boolean) => {
      const presence = getPresenceState()[key]?.[0];
      if (!presence) return;

      const addNewUser = (stream: MediaStream | null = null) => {
        joinedUsers.push({ presenceKey: key, info: presence.user, stream });
        if (!isInitiator) toast(`${presence.user.name} has joined the meeting!`);
      };

      peer.on('close', () => {
        let userIndex = -1;
        joinedUsers.reset(arr => {
          userIndex = arr.findIndex(({ presenceKey }) => presenceKey === key);
          return arr;
        });

        if (userIndex === -1) return;

        joinedUsers.pop(userIndex);
        toast(`${presence.user.name} has left.`);
      });

      if (signal.withStream) {
        peer.on('stream', stream => {
          const tracks = getMediaTracks(stream);

          if (tracks.video) tracks.video.enabled = presence.state.video;
          if (tracks.audio) tracks.audio.enabled = presence.state.audio;

          addNewUser(stream);
        });
      } else {
        addNewUser();
      }

      participantsRef.current.push(key);
    },
    [],
  );

  const sendChatMessage = React.useCallback((info: MeetingUser['info'], message: string) => {
    return channelRef.current?.send({
      type: 'broadcast',
      event: broadcastEvents.CHAT_MESSAGE,
      payload: {
        user: { name: info.name, image: info.image },
        message,
      } satisfies ChatMessagePayload['payload'],
    });
  }, []);

  const streamRef = React.useRef(stream);
  React.useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  return {
    channelRef,
    presenceKey,
    joinedUsers: joinedUsers.array,
    waitingUsers: waitingUsers.array,
    chatMessages: chatMessages.array,
    host: roomHost,
    connectToChannel,
    track,
    leaveChannel,
    getPresenceState,
    sendJoinResponse,
    sendChatMessage,
    hangUp,
  };
}
