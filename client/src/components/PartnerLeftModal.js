import React from 'react';

const PartnerLeftModal = ({ open, message, onEndChat, onNext }) => {
  if (!open) return null;

  return (
    <dialog open className="modal modal-open z-[100]">
      <div className="modal-box max-w-sm">
        <h3 className="font-bold text-lg">Partner left</h3>
        <p className="py-3 text-sm text-base-content/70">
          {message || 'Your partner has left the chat.'}
        </p>
        <div className="modal-action flex-col sm:flex-row gap-2">
          <button type="button" className="btn btn-ghost flex-1" onClick={onEndChat}>
            End Chat
          </button>
          <button type="button" className="btn btn-primary flex-1 gap-1" onClick={onNext}>
            ⏭ Next Match
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-black/50">
        <button type="button" onClick={onEndChat} aria-label="Close">
          close
        </button>
      </form>
    </dialog>
  );
};

export default PartnerLeftModal;
