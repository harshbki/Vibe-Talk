import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePromptModal = ({ show, onClose }) => {
  const navigate = useNavigate();

  if (!show) return null;

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box max-w-sm text-center">
        <h3 className="font-bold text-lg">👤 Complete Your Profile</h3>
        <p className="py-3 text-base-content/70 text-sm">
          Complete your profile to unlock features like gender filter DMs, random match, and groups.
        </p>
        <div className="modal-action justify-center gap-3">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              onClose();
              navigate('/profile');
            }}
          >
            Go to Profile
          </button>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Maybe Later
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
};

export default ProfilePromptModal;
