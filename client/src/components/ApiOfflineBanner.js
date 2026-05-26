import React, { useEffect, useState } from 'react';

function getSocketUrl() {
  const { hostname } = window.location;
  if (hostname.endsWith('.app.github.dev') || hostname.endsWith('.codespaces.dev'))
    return window.location.origin;
  return process.env.REACT_APP_SOCKET_URL || 'http://localhost:8081';
}

const healthUrl = () => {
  const base = getSocketUrl();
  return `${base.replace(/\/$/, '')}/api/health`;
};

const ApiOfflineBanner = () => {
  const [offline, setOffline] = useState(false);
  const [mongoDown, setMongoDown] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const res = await fetch(healthUrl(), { cache: 'no-store' });
        if (!res.ok) throw new Error('bad status');
        const data = await res.json();
        if (cancelled) return;
        setOffline(false);
        setMongoDown(data.mongo !== 'connected');
      } catch {
        if (!cancelled) {
          setOffline(true);
          setMongoDown(false);
        }
      }
    };

    check();
    const id = setInterval(check, 8000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (!offline && !mongoDown) return null;

  return (
    <div className="bg-error text-error-content text-center text-sm py-2 px-4 z-[200]">
      {offline ? (
        <>
          API server offline — start backend: <code className="font-mono">cd server && npm start</code> (port 8081).
          Mongo: <code className="font-mono">npm run mongo</code>
        </>
      ) : (
        <>MongoDB not connected — start MongoDB, then restart the server.</>
      )}
    </div>
  );
};

export default ApiOfflineBanner;
