import { Logo } from '~/components/logo';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="grid w-full max-w-sm -translate-y-10 gap-4">
        <div className="mb-2 grid gap-2 text-center">
          <Logo type="mark" className="mx-auto *:w-20" />
          <h2 className="text-2xl">Reset your password</h2>
        </div>
        {children}
      </div>
    </div>
  );
}
