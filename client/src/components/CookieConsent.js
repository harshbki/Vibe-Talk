import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'vtCookieOk';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-base-100 border-t border-base-300 shadow-lg px-4 py-3">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <p className="text-base-content/75 text-center sm:text-left">
          This website uses cookies to ensure you get the best experience.{' '}
          <Link to="/privacy" className="text-primary underline">
            More info
          </Link>
        </p>
        <button
          type="button"
          onClick={accept}
          className="btn btn-sm bg-amber-400 hover:bg-amber-500 border-0 text-base-content font-semibold px-6 shrink-0"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
