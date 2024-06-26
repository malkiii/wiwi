import type { Metadata } from 'next';
import { SignupForm } from './form';

export const metadata: Metadata = {
  title: 'Signup',
};

export default function Page() {
  return <SignupForm />;
}
