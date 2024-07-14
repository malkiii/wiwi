import { extractMeetingCode } from '~/lib/utils';

import { MeetingRoom } from './meeting-room';
import { MeetingRoomProvider } from './meeting-room-provider';
import { WarningPage } from './waning-page';

export default async function Page(props: { params: { code: string } }) {
  const code = extractMeetingCode(props.params.code)!;

  const meeting = true;

  if (!meeting) {
    return (
      <WarningPage
        title="Check your meeting code"
        description="Make sure that you're using a correct meeting code."
      />
    );
  }

  return (
    <MeetingRoomProvider code={code}>
      <MeetingRoom />
    </MeetingRoomProvider>
  );
}
