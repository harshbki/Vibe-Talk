import React, { useEffect } from 'react';
import AuthPageLayout from '../components/AuthPageLayout';
import JoinForm from '../components/JoinForm';

const StartChatPage = () => {
  useEffect(() => {
    document.title = 'Join Chat — Vibe Talk | Free Anonymous Chat';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Join Vibe Talk free — pick a nickname and start chatting. Guest login, random match, video calls. No registration required.'
      );
    }
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) robots.setAttribute('content', 'noindex, follow');
  }, []);

  return (
    <AuthPageLayout>
      <JoinForm />
    </AuthPageLayout>
  );
};

export default StartChatPage;
