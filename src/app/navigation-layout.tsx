import { default as NextLink } from 'next/link';
import { Button } from '~/components/ui/button';
import { Link } from '~/components/ui/link';
import { Logo } from '~/components/logo';
import site from '~/constants/site';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

export function NavigationLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="relative mx-auto w-full max-w-7xl flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="p-4">
      <div className="mx-auto flex max-w-7xl justify-between">
        <Logo type="logotype" />
        <nav className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button asChild>
            <NextLink href="/login">Login</NextLink>
          </Button>
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

function Footer() {
  return (
    <footer className="text-balance p-4 pb-8 text-center text-sm">
      &copy; {new Date().getFullYear()} By <Link href={site.author.url}>{site.author.name}</Link>,
      All Rights Reserved | <Link href="/privacy">Privacy Policy</Link> |{' '}
      <Link href="/terms">Terms of Service</Link>
    </footer>
  );
}
