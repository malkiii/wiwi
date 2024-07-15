// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';
import type { RealtimePresenceState } from '@supabase/supabase-js';
import type Peer from 'simple-peer';

declare module 'next-auth/jwt' {
  interface JWT {
    user: User;
  }
}

export type User = Session['user'];

export type MeetingUser = {
  info: User;
  presenceKey: string;
  stream: MediaStream | null;
};

export type PresenceState = RealtimePresenceState<{ user: User }>;

export type Payload<T = Record<string, string>> = {
  type: string;
  event: string;
  payload?: T;
};

export type JoinResponsePayload = Payload<{
  key: string;
  status: 'ACCEPTED' | 'REJECTED';
}>;

export type ConnectionSignal = {
  withStream: boolean;
  data: Peer.SignalData;
};

export type RequestSignals = Record<string, ConnectionSignal>;

export type ConnectionRequestPayload = Payload<{
  key: string;
  signals: RequestSignals;
}>;

export type ConnectionResponsePayload = Payload<{
  key: string;
  callerKey: string;
  signal: ConnectionSignal;
}>;

export type PeerDataPayload = {
  state: { video?: boolean; audio?: boolean };
};
