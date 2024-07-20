// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';
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

export type MediaState = { video: boolean; audio: boolean };

export type PresenceStateValue = {
  user: User;
  state: MediaState;
};

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

export type ChatMessage = {
  user: { name: string; image: string | null };
  message: string;
};

export type ChatMessagePayload = Payload<ChatMessage>;

export type LeaveEventPayload = Payload<{
  key: string;
  name: string;
}>;
