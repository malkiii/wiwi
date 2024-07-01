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

import {
  VideoIcon,
  SettingsIcon,
  PrivacyIcon,
  TermsIcon,
  HelpIcon,
  LogOutIcon,
} from '~/components/icons';

import site from '~/constants/site';
import { useSession } from './session-provider';
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

  if (!user) {
    return (
      <Button asChild>
        <NextLink href="/login">Login</NextLink>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <UserAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[170px] *:w-full" align="end">
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
    name: 'Help',
    pathname: '/help',
    icon: HelpIcon,
  },
];

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
