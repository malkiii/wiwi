import { UserAvatar } from '~/components/user-avatar';
import { MeetingInput } from './meeting-input';

export default function Page() {
  return (
    <div className="mx-auto grid w-full max-w-[320px] gap-4 pt-40 max-md:pt-20">
      <UserAvatar size={240} className="mx-auto size-[180px] text-2xl max-md:size-[120px]" />
      <MeetingInput />
    </div>
  );
}
