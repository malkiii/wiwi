'use client';

import { default as NextLink } from 'next/link';
import { Button } from '~/components/ui/button';
import { Link } from '~/components/ui/link';
import { Logo } from '~/components/logo';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import site from '~/constants/site';
import { useSession } from './session-provider';
import { UserAvatar } from '~/components/user-avatar';
import { LogOutIcon } from '~/components/icons';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { cn } from '~/lib/utils';

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
          <LanguageSwitcher />
          <UserNavigationMenu />
        </nav>
      </div>
    </header>
  );
}

function LanguageSwitcher() {
  return (
    <Select>
      <SelectTrigger className="w-28">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent defaultValue="English">
        <SelectItem value="English">English</SelectItem>
        <SelectItem value="Spanish">Española</SelectItem>
        <SelectItem value="French">Français</SelectItem>
        <SelectItem value="Arabic">العربية</SelectItem>
      </SelectContent>
    </Select>
  );
}

function UserNavigationMenu() {
  const { user } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) {
    return (
      <Button asChild>
        <NextLink href="/login">Login</NextLink>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn('rounded-full', isLoggingOut && 'pointer-events-none opacity-70')}
      >
        <UserAvatar key={user.id} user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[170px]" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button
            className="block w-full"
            onClick={() => {
              setIsLoggingOut(true);
              signOut();
            }}
          >
            <LogOutIcon className="mr-2 size-4" /> Log Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Footer() {
  return (
    <footer className="text-balance p-4 text-sm max-lg:text-center">
      &copy; {new Date().getFullYear()} By{' '}
      <Link href={site.author.url} className="underline">
        {site.author.name}
      </Link>
      <span className="hidden lg:inline">, All Rights Reserved</span>
    </footer>
  );
}
