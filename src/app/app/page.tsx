import type { Metadata } from 'next';
import { MeetingInput, MeetingInputLabel } from './meeting-input';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function Page() {
  return (
    <div className="mx-auto grid w-full max-w-[320px] gap-4 pt-40 max-md:pt-20">
      <MeetingInputLabel />
      <MeetingInput />
    </div>
  );
}
