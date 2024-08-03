import type { Metadata } from 'next';
import { extractMeetingCode } from '~/lib/utils';

import { MeetingRoom } from './meeting-room';
import { MeetingRoomProvider } from './provider';

export async function generateMetadata(props: { params: { code: string } }): Promise<Metadata> {
  return { title: props.params.code };
}

export default async function Page(props: { params: { code: string } }) {
  const code = extractMeetingCode(props.params.code)!;

  return (
    <MeetingRoomProvider code={code}>
      <MeetingRoom />
    </MeetingRoomProvider>
  );
}
