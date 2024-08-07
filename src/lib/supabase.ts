import { createClient } from '@supabase/supabase-js';
import { env } from '~/env';

export const client = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    realtime: {
      // timeout: Infinity,
    },
  },
);

const eventsArray = [
  'JOIN_RESPONSE',
  'CONNECTION_REQUEST',
  'CONNECTION_RESPONSE',
  'CHAT_MESSAGE',
  'LEAVE',
] as const;

export const broadcastEvents = eventsArray.reduce<{
  [K in (typeof eventsArray)[number]]: Lowercase<K>;
}>((acc, event) => {
  // @ts-ignore
  acc[event] = event.toLowerCase();

  return acc;
}, {} as any);
