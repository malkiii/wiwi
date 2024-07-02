'use client';

import Link from 'next/link';
import { Logo } from '~/components/logo';
import { Button } from '~/components/ui/button';
import { Divider } from '~/components/ui/divider';
import { LogOutButton } from '~/components/logout-button';

import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';

import {
  VideoIcon,
  SettingsIcon,
  PrivacyIcon,
  TermsIcon,
  HelpIcon,
  LogOutIcon,
  MenuIcon,
} from '~/components/icons';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationMenu() {
  return (
    <>
      <div className="flex items-center justify-between p-4 pl-2 sm:hidden">
        <Logo type="logotype" />
        <HamburguerMenu />
      </div>
      <div className="flex w-fit flex-col border-r py-4 max-sm:hidden">
        <Logo type="mark" className="mb-6 pl-2" />
        <nav className="group flex-1">
          <NavigationMenuItems />
        </nav>
      </div>
    </>
  );
}

function HamburguerMenu() {
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <Sheet open={isNavigating ? false : undefined}>
      <SheetTrigger asChild>
        <Button variant="outline" className="aspect-square h-10 px-0">
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-full max-w-sm px-2 pt-12"
        onClick={(e: any) => {
          const target = e.target as HTMLElement;
          setIsNavigating(!!target.closest('a'));
        }}
      >
        <NavigationMenuItems />
      </SheetContent>
    </Sheet>
  );
}

function NavigationMenuItems() {
  const pathname = usePathname();

  return (
    <div className="flex min-h-full flex-col justify-between px-2">
      <div className="grid gap-2 *:justify-start">
        {menuItems.map((item, index) =>
          item ? (
            <Button
              key={index}
              variant={item.pathname === pathname ? 'ghost-active' : 'ghost-inactive'}
              asChild
            >
              <Link href={item.pathname}>
                <item.icon className="size-5" />
                <span className="ml-3 inline-block overflow-hidden whitespace-nowrap transition-[width,margin,opacity] duration-200 group-hover:ml-3 group-hover:w-40 group-hover:opacity-100 sm:ml-0 sm:w-0 sm:opacity-0">
                  {item.name}
                </span>
              </Link>
            </Button>
          ) : (
            <Divider key={index} />
          ),
        )}
      </div>
      <LogOutButton variant="ghost-inactive" className="justify-start text-left">
        <LogOutIcon className="size-5" />
        <span className="ml-3 inline-block overflow-hidden whitespace-nowrap transition-[width,margin,opacity] duration-200 group-hover:ml-3 group-hover:w-40 group-hover:opacity-100 sm:ml-0 sm:w-0 sm:opacity-0">
          Log Out
        </span>
      </LogOutButton>
    </div>
  );
}

type NavigationMenuItem = {
  name: string;
  pathname: string;
  icon: React.FC<React.ComponentProps<'svg'>>;
} | null;

const menuItems: NavigationMenuItem[] = [
  {
    name: 'Meetings',
    pathname: '/app',
    icon: VideoIcon,
  },
  null,
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
