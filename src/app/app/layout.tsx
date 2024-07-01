import { NavigationMenu } from './navigation-menu';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex min-h-dvh max-sm:flex-col">
      <NavigationMenu />
      <div className="flex-1 px-4">{children}</div>
    </div>
  );
}
