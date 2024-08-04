import type { Metadata } from 'next';
import { NavigationLayout } from '../navigation-layout';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function Page() {
  return (
    <NavigationLayout>
      <article className="mb-8 px-4 pt-10">
        <h1>Terms of Service</h1>
        <h2>Acceptance of Terms</h2>
        <p>
          By using WiWi, you agree to be bound by these Terms of Service, all applicable laws and
          regulations, and agree that you are responsible for compliance with any applicable local
          laws. If you do not agree with any of these terms, you are prohibited from using or
          accessing this site.
        </p>
        <h2>Description of Service</h2>
        <p>
          WiWi is a platform that enables users to host and participate in online meetings. The
          Service allows users to create meeting rooms, invite others to join, and communicate
          through video, audio, and text chat. WiWi is free to use.
        </p>
        <h2>User Accounts</h2>
        <p>
          To use WiWi, you may be required to create a user account. You are responsible for
          maintaining the confidentiality of your account credentials and for all activities that
          occur under your account. You agree to notify WiWi immediately of any unauthorized use of
          your account or password. WiWi cannot and will not be liable for any loss or damage
          arising from your failure to comply with this section.
        </p>
        <h2>User Conduct</h2>
        <p>
          You agree to use WiWi in accordance with all applicable laws and regulations. You are
          solely responsible for your conduct and any content you generate or share while using the
          Service. You agree not to:
        </p>
        <ul>
          <li>Use WiWi for any illegal or unauthorized purpose.</li>
          <li>Harass, threaten, or intimidate other users.</li>
          <li>Engage in any activity that interferes with or disrupts the Service.</li>
          <li>Upload, share, or distribute any harmful, offensive, or obscene content.</li>
          <li>Violate the intellectual property rights of others.</li>
        </ul>
        <h2>Intellectual Property</h2>
        <p>
          All intellectual property rights in and to the WiWi Service, including but not limited to
          trademarks, copyrights, patents, and trade secrets, are owned by or licensed to us. You
          may not use, reproduce, distribute, or create derivative works based on the Service or any
          part thereof without our prior written consent.
        </p>
        <h2>Disclaimer of Warranties</h2>
        <p>
          WiWi is provided &quot;as is&quot; and without warranty of any kind, whether express or
          implied, including, but not limited to, the implied warranties of merchantability, fitness
          for a particular purpose, and non-infringement. We make no warranties about the
          reliability, availability, or accuracy of the Service. Your use of WiWi is at your own
          risk.
        </p>
        <h2>Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, WiWi and its affiliates shall not be liable for
          any indirect, incidental, special, consequential, or exemplary damages, including, but not
          limited to, damages for loss of profits, goodwill, use, data, or other intangible losses
          arising out of or in connection with the use or inability to use the Service.
        </p>
      </article>
    </NavigationLayout>
  );
}
