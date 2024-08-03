import { Logo } from '~/components/logo';

export default function Page() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="grid w-full -translate-y-10 gap-4">
        <div className="grid gap-4 text-center">
          <Logo type="mark" className="mx-auto *:w-32" />
          <h2 className="max-sm:3xl text-5xl">ERROR 404</h2>
        </div>
        <p className="text-pretty text-center text-lg">
          Sorry, the page you&apos;re looking for does not exist.
        </p>
      </div>
    </div>
  );
}
