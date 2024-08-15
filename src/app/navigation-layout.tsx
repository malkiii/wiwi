'use client';

import { default as NextLink } from 'next/link';
import { Button } from '~/components/ui/button';
import { Link } from '~/components/ui/link';
import { Logo } from '~/components/logo';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import {
  VideoIcon,
  SettingsIcon,
  PrivacyIcon,
  TermsIcon,
  HelpIcon,
  LogOutIcon,
} from '~/components/icons';

import site from '~/constants/site';
import { useSession } from '~/components/session-provider';
import { UserAvatar } from '~/components/user-avatar';
import { LogOutButton } from '~/components/logout-button';

export function NavigationLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[1375px] flex-col">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="p-4 pl-2">
      <div className="mx-auto flex justify-between">
        <Logo type="logotype" />
        <nav className="flex items-center gap-4">
          <UserNavigationMenu />
        </nav>
      </div>
    </header>
  );
}

function UserNavigationMenu() {
  const { user } = useSession();

  if (!user) {
    return (
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <NextLink href="/register">Sign Up</NextLink>
        </Button>
        <Button asChild>
          <NextLink href="/login">Login</NextLink>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[180px] *:w-full" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.map((item, index) =>
          item ? (
            <DropdownMenuItem key={item.pathname} asChild>
              <NextLink href={item.pathname}>
                <item.icon className="mr-2 size-4" /> {item.name}
              </NextLink>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuSeparator key={'div-' + index} />
          ),
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogOutButton className="w-full">
            <LogOutIcon className="mr-2 size-4" /> Log Out
          </LogOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const menuItems = [
  {
    name: 'Meetings',
    pathname: '/app',
    icon: VideoIcon,
  },
  {
    name: 'Settings',
    pathname: '/app/settings',
    icon: SettingsIcon,
  },
  null,
  {
    name: 'Privacy Policy',
    pathname: '/privacy',
    icon: PrivacyIcon,
  },
  {
    name: 'Terms of Service',
    pathname: '/terms',
    icon: TermsIcon,
  },
  {
    name: 'Help & Support',
    pathname: '/support',
    icon: HelpIcon,
  },
];

function Footer() {
  return (
    <footer className="text-balance py-4 text-center text-sm">
      &copy; {new Date().getFullYear()} By{' '}
      <Link href={site.author.url} className="underline">
        {site.author.name}
      </Link>
      , All Rights Reserved
    </footer>
  );
}
