import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { getUser } from '../api';

const DmToast = () => {
  const { dmToast, clearDmToast, setSelectedUser } = useChat();
  const navigate = useNavigate();

  if (!dmToast) return null;

  const openChat = async () => {
    try {
      const sender = await getUser(dmToast.from);
      setSelectedUser({
        _id: sender._id,
        nickname: sender.nickname,
        gender: sender.gender
      });
    } catch {
      setSelectedUser({
        _id: dmToast.from,
        nickname: dmToast.nickname,
        gender: 'Male'
      });
    }
    clearDmToast();
    navigate('/chat');
  };

  return (
    <div className="fixed bottom-4 right-4 z-[90] max-w-sm w-full animate-scale-in">
      <div className="alert shadow-lg bg-base-100 border border-base-300 flex-col items-stretch gap-2">
        <div className="flex w-full justify-between items-start gap-2">
          <div>
            <p className="font-semibold text-sm">New message from {dmToast.nickname}</p>
            <p className="text-xs opacity-70 line-clamp-2">{dmToast.preview}</p>
          </div>
          <button type="button" className="btn btn-ghost btn-xs btn-circle" onClick={clearDmToast} aria-label="Dismiss">
            ✕
          </button>
        </div>
        <button type="button" className="btn btn-primary btn-sm w-full" onClick={openChat}>
          Open chat
        </button>
      </div>
    </div>
  );
};

export default DmToast;
