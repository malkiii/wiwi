import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserAvatarFallback(name: string) {
  const [firstName, lastName] = name.split(/\s+/);
  if (!firstName) return '';

  if (lastName) {
    return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
  }

  return firstName.slice(0, 2).toUpperCase();
}
