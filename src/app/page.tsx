import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { VideoIcon, StarIcon } from '~/components/icons';
import { NavigationLayout } from './navigation-layout';
import Image from 'next/image';

export default function Page() {
  return (
    <NavigationLayout>
      <main className="relative flex w-full flex-grow items-center justify-between px-4 max-lg:flex-col max-lg:pb-8">
        <div className="max-w-2xl max-lg:mt-8 max-lg:max-w-full">
          <h1 className="mb-4 text-4xl md:text-6xl lg:mb-8 lg:text-balance">
            Start your video calls and meetings with WiWi
          </h1>
          <p className="text-balance text-xl tracking-tight md:text-2xl">
            Fast and high quality real-time meetings, share your screen, and collaborate with your
            team.
          </p>
          <div className="my-8 flex gap-4 lg:my-16">
            <Button asChild>
              <Link href="/register" className="gap-2">
                <VideoIcon /> Get Started
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://github.com/malkiii/wiwi" target="_blank" className="gap-2">
                <StarIcon /> Star on GitHub
              </a>
            </Button>
          </div>
        </div>
        <div className="w-full max-w-screen-sm select-none">
          <Image
            priority
            src="/hero.svg"
            width={547}
            height={417}
            className="w-full"
            alt="Hero image"
          />
        </div>
      </main>
    </NavigationLayout>
  );
}
