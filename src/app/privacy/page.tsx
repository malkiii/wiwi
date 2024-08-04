import type { Metadata } from 'next';
import site from '~/constants/site';
import { NavigationLayout } from '../navigation-layout';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function Page() {
  return (
    <NavigationLayout>
      <article className="mb-8 px-4 pt-10">
        <h1>Privacy Policy</h1>
        <p>
          WiWi is committed to protecting the privacy of its users. This Privacy Policy outlines how
          we collect, use, disclose, and protect your personal information.
        </p>

        <h2>Information We Collect</h2>
        <p>When you use WiWi, we may collect certain personal information, including:</p>
        <ul>
          <li>
            <b>Name:</b> Required for account creation and identification.
          </li>
          <li>
            <b>Email address:</b> Used for account creation, password recovery, and communication.
          </li>
          <li>
            <b>Profile picture:</b> Optional, used for user identification within the platform.
          </li>
        </ul>
        <p>We collect this information through forms you complete on our website.</p>

        <h2>How We Use Your Information</h2>
        <p>We use the collected information for the following purposes:</p>
        <ul>
          <li>
            <b>Account creation and management:</b> To create and manage your WiWi account.
          </li>
          <li>
            <b>Authentication:</b> To verify your identity when accessing your account.
          </li>
        </ul>
        <p>We do not share your personal information with any third parties.</p>

        <h2>Data Security</h2>
        <p>
          We employ industry-standard security measures to protect your personal information from
          unauthorized access, disclosure, alteration, or destruction. This includes encryption and
          the use of JWTs with secret keys.
        </p>

        <h2>Children&apos;s Privacy</h2>
        <p>
          WiWi is not intended for use by children under the age of 13. We do not knowingly collect
          personal information from children.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy, please contact me at{' '}
          <a href={`mailto:${site.author.email}`}>{site.author.email}</a>.
        </p>
      </article>
    </NavigationLayout>
  );
}
