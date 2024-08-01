import AvatarSection from './avatar';
import FullNameSection from './full-name';
import EmailSection from './email';
import DeleteAccountSection from './delete-account';

export default function Page() {
  return (
    <div className="mx-auto grid w-full max-w-md gap-4 py-20 max-sm:py-12">
      <AvatarSection />
      <FullNameSection />
      <EmailSection />
      <DeleteAccountSection />
    </div>
  );
}
