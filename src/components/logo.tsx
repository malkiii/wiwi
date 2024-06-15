import Link from 'next/link';
import { cn } from '~/lib/utils';

type LogoProps = Omit<React.ComponentProps<typeof Link>, 'href'> & {
  type: 'mark' | 'logotype';
};

export function Logo({ type, className, ...props }: LogoProps) {
  return (
    <Link
      href="/"
      {...props}
      className={cn('group flex w-fit select-none items-center', className)}
    >
      <svg width="56" viewBox="0 0 820 555" className="pointer-events-none block" fill="none">
        <g>
          <path
            d="M472.5 229.869C509.167 251.038 509.167 303.962 472.5 325.131L221.25 470.191C184.583 491.36 138.75 464.898 138.75 422.559L138.75 132.441C138.75 90.1016 184.583 63.6398 221.25 84.8093L472.5 229.869Z"
            fill="#09090B"
          />
          <path
            className="transition-transform group-hover:translate-x-20"
            d="M636.735 229.869C673.401 251.038 673.401 303.962 636.735 325.131L385.485 470.191C348.818 491.36 302.985 464.898 302.985 422.559L302.985 132.441C302.985 90.1016 348.818 63.6398 385.485 84.8093L636.735 229.869Z"
            fill="#27272A"
            fillOpacity="0.75"
          />
        </g>
      </svg>
      {type === 'logotype' && (
        <div className="heading pr-3 text-2xl font-black">
          <span>W</span>
          <span className="opacity-75">i</span>
          <span>W</span>
          <span className="opacity-75">i</span>
        </div>
      )}
    </Link>
  );
}
