import React, { useEffect } from 'react';
import PublicLayout from '../components/PublicLayout';

const PrivacyPage = () => {
  useEffect(() => {
    document.title = 'Privacy Policy — Vibe Talk';
  }, []);

  return (
    <PublicLayout>
      <article className="max-w-3xl mx-auto px-4 py-12 prose prose-sm max-w-none">
        <h1 className="text-3xl font-extrabold mb-6">Privacy Policy</h1>
        <p className="text-base-content/70 mb-4">Last updated: {new Date().toLocaleDateString('en-IN')}</p>

        <section className="space-y-4 text-base-content/80 text-sm leading-relaxed">
          <p>
            Vibe Talk (&quot;we&quot;, &quot;vibetalk.me&quot;) respects your privacy. This policy explains what data we
            collect when you use our chat, random match, video call, and group features.
          </p>
          <h2 className="text-lg font-bold text-base-content pt-4">Information we collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Nickname, gender (guest login), and optional profile details (full name, date of birth, bio, photo).</li>
            <li>Messages and media you send through the platform.</li>
            <li>Technical data: IP address, browser type, device info (for security and analytics).</li>
            <li>Cookies for session and site functionality.</li>
          </ul>
          <h2 className="text-lg font-bold text-base-content pt-4">How we use data</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide chat, match, video, and group services.</li>
            <li>To improve safety, prevent abuse, and maintain service quality.</li>
            <li>To show relevant ads (Google AdSense, Monetag) on our free service.</li>
          </ul>
          <h2 className="text-lg font-bold text-base-content pt-4">Third parties</h2>
          <p>
            We use MongoDB Atlas (hosting), Cloudinary (media), Render (hosting), Google AdSense, and Monetag.
            These services have their own privacy policies.
          </p>
          <h2 className="text-lg font-bold text-base-content pt-4">Your rights</h2>
          <p>
            You may delete your account from Profile settings. Contact us at your support email for data requests.
          </p>
          <h2 className="text-lg font-bold text-base-content pt-4">Contact</h2>
          <p>Questions: privacy@vibetalk.me</p>
        </section>
      </article>
    </PublicLayout>
  );
};

export default PrivacyPage;
