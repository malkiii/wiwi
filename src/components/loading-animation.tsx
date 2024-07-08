import { cn } from '~/lib/utils';

type LoadingAnimationProps = React.ComponentProps<'svg'>;

export function LoadingAnimation({ className, ...props }: LoadingAnimationProps) {
  return (
    <svg
      {...props}
      viewBox="0 0 820 555"
      className={cn('pointer-events-none block w-16 fill-none', className)}
    >
      <g>
        <path
          d="M472.5 229.869C509.167 251.038 509.167 303.962 472.5 325.131L221.25 470.191C184.583 491.36 138.75 464.898 138.75 422.559L138.75 132.441C138.75 90.1016 184.583 63.6398 221.25 84.8093L472.5 229.869Z"
          className="fill-primary"
        />
        <path
          className="translate-x-80 fill-primary opacity-0 duration-700 animate-in fade-in-100 repeat-infinite"
          d="M472.5 229.869C509.167 251.038 509.167 303.962 472.5 325.131L221.25 470.191C184.583 491.36 138.75 464.898 138.75 422.559L138.75 132.441C138.75 90.1016 184.583 63.6398 221.25 84.8093L472.5 229.869Z"
        />
      </g>
    </svg>
  );
}
