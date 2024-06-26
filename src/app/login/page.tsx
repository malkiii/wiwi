import type { Metadata } from 'next';
import { LoginForm } from './form';

export const metadata: Metadata = {
  title: 'Login',
};

export default function Page() {
  return <LoginForm />;
}
