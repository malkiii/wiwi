import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { VideoIcon } from '~/components/icons';
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
          <p className="text-balance text-xl md:text-2xl">
            Fast and high quality real-time meetings, share your screen, and collaborate with your
            team.
          </p>
          <div className="my-8 flex gap-4 lg:my-16">
            <Button asChild>
              <Link href="/app" className="gap-2">
                <VideoIcon /> Get Started
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/learn">Learn more</Link>
            </Button>
          </div>
        </div>
        <MeetingDemo />
      </main>
    </NavigationLayout>
  );
}

function MeetingDemo() {
  return (
    <div className="grid select-none grid-cols-2 grid-rows-2 gap-4 *:bg-muted lg:max-w-xl">
      <Image
        priority
        src="/images/home/caller-2.png"
        width={1080}
        height={1080}
        className="self-end rounded-lg"
        alt="Caller 2"
      />
      <div className="flex aspect-square items-center justify-center self-end rounded-lg">
        <Image
          priority
          src="/images/home/caller-3.png"
          width={360}
          height={360}
          className="aspect-square w-1/3 rounded-full"
          alt="Caller 3"
        />
      </div>
      <Image
        priority
        src="/images/home/caller-1.png"
        width={2160}
        height={1080}
        className="col-span-2 w-full self-baseline rounded-lg"
        alt="Caller 1"
      />
    </div>
  );
}
