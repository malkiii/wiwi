'use client';

import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';

import { Logo } from '~/components/logo';
import { Button } from '~/components/ui/button';
import { Divider } from '~/components/ui/divider';
import { LogOutButton } from '~/components/logout-button';
import { FeedbackModal } from '~/components/feedback-modal';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';
import {
  VideoIcon,
  SettingsIcon,
  PrivacyIcon,
  TermsIcon,
  FeedbackIcon,
  HelpIcon,
  LogOutIcon,
  MenuIcon,
} from '~/components/icons';

export function NavigationMenu() {
  return (
    <>
      <div className="flex items-center justify-between p-4 pl-2 sm:hidden">
        <Logo type="logotype" />
        <HamburguerMenu />
      </div>
      <div className="relative w-fit max-sm:hidden">
        <div className="sticky top-0 flex h-dvh w-fit flex-col border-r py-4">
          <Logo type="mark" className="mb-6 pl-2" />
          <nav className="group flex-1">
            <NavigationMenuItems />
          </nav>
        </div>
      </div>
    </>
  );
}

function HamburguerMenu() {
  const [isNavigating, setIsNavigating] = React.useState(false);

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
        {menuItems.map((item, index) => {
          if (!item) return <Divider key={index} />;

          const isFeedback = item.name === 'Feedback';
          const Wrapper = isFeedback ? FeedbackModal : React.Fragment;
          const ButtonContent = isFeedback ? React.Fragment : Link;

          return (
            <Wrapper key={index}>
              <Button
                variant={item.pathname === pathname ? 'ghost-active' : 'ghost-inactive'}
                className="justify-start text-left"
                asChild={!isFeedback}
              >
                <ButtonContent href={item.pathname}>
                  <item.icon className="size-5" />
                  <span className="ml-3 inline-block overflow-hidden whitespace-nowrap transition-[width,margin,opacity] duration-200 group-hover:ml-3 group-hover:w-40 group-hover:opacity-100 sm:ml-0 sm:w-0 sm:opacity-0">
                    {item.name}
                  </span>
                </ButtonContent>
              </Button>
            </Wrapper>
          );
        })}
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
  null,
  {
    name: 'Feedback',
    pathname: '#',
    icon: FeedbackIcon,
  },
  {
    name: 'Help & Support',
    pathname: '/support',
    icon: HelpIcon,
  },
];
