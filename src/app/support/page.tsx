import { Logo } from '~/components/logo';
import { SupportForm } from './form';

export default function Page() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="grid w-full max-w-md gap-4">
        <div className="mb-2 grid gap-2 text-center">
          <Logo type="mark" {...{ href: '/' }} className="mx-auto *:w-20" />
          <h2 className="text-3xl">I need some help!</h2>
        </div>
        <SupportForm />
      </div>
    </div>
  );
}
