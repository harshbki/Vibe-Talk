import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfileBanner = () => {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (!user || user.isFullAccount || dismissed) return null;

  return (
    <div className="bg-warning/10 border-b border-warning/30 px-4 py-2.5 flex items-center justify-between gap-3 animate-fade-in-up">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-warning text-lg">⚠️</span>
        <span className="text-base-content/80">
          Complete your profile to unlock all features!
        </span>
        <Link to="/profile" className="btn btn-warning btn-xs gap-1 ml-1">
          👤 Complete Profile
        </Link>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-base-content"
      >
        ✕
      </button>
    </div>
  );
};

export default ProfileBanner;
