import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { getProfile } from '../api';

const UserProfilePage = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const { setSelectedUser, onlineUsers } = useChat();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(userId);
        setProfile(data);
      } catch (err) {
        console.error('Fetch profile error:', err);
        navigate('/users');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId, navigate]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!profile) return null;

  const isOwn = profile._id === user?._id;
  const isOnline = onlineUsers.some(ou => ou._id === profile._id);
  const isPrivate = profile.privacy?.profileVisible === 'private' && !isOwn;

  const calculateAge = (dob) => {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  };

  const age = calculateAge(profile.dateOfBirth);

  const handleChat = () => {
    setSelectedUser({ _id: profile._id, nickname: profile.nickname, gender: profile.gender });
    navigate('/chat');
  };

  if (isPrivate) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-base-200/50 p-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body items-center text-center gap-4">
            <div className="text-5xl">🔒</div>
            <h2 className="text-xl font-bold">Private Profile</h2>
            <p className="text-base-content/60 text-sm">This user has set their profile to private.</p>
            <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm">← Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-base-200/50 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center gap-5">
          {/* Avatar */}
          <div className="relative">
            {profile.profilePicture ? (
              <div className="avatar">
                <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={profile.profilePicture} alt={profile.nickname} />
                </div>
              </div>
            ) : (
              <div className="avatar placeholder">
                <div className={`w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 ${profile.gender === 'Male' ? 'bg-primary/15 text-primary' : 'bg-secondary/15 text-secondary'}`}>
                  <span className="text-4xl font-bold">{profile.nickname?.charAt(0).toUpperCase()}</span>
                </div>
              </div>
            )}
            {isOnline && (
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-success rounded-full border-2 border-base-100" />
            )}
          </div>

          <div>
            <h2 className="text-xl font-extrabold">{profile.nickname}</h2>
            {profile.fullName && <p className="text-base-content/60 text-sm mt-0.5">{profile.fullName}</p>}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className={`badge ${profile.gender === 'Male' ? 'badge-primary' : 'badge-secondary'} badge-outline gap-1`}>
              {profile.gender === 'Male' ? '👨' : '👩'} {profile.gender}
            </span>
            {age && (
              <span className="badge badge-outline gap-1">🎂 {age} yrs</span>
            )}
            <span className={`badge ${isOnline ? 'badge-success' : 'badge-ghost'} badge-outline gap-1`}>
              {isOnline ? '● Online' : '○ Offline'}
            </span>
          </div>

          {/* Location */}
          {profile.location && (
            <p className="text-sm text-base-content/60">📍 {profile.location}</p>
          )}

          {/* Bio */}
          {profile.bio && (
            <p className="text-base-content/70 text-sm max-w-xs">{profile.bio}</p>
          )}

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center">
              {profile.interests.map(interest => (
                <span key={interest} className="badge badge-primary badge-outline badge-sm">{interest}</span>
              ))}
            </div>
          )}

          <div className="text-xs text-base-content/40">
            Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>

          {!isOwn && (
            <div className="flex gap-3 w-full pt-2">
              {user?.isFullAccount ? (
                <button onClick={handleChat} className="btn btn-primary flex-1 gap-2">
                  💬 Chat
                </button>
              ) : (
                <button onClick={() => navigate('/profile')} className="btn btn-warning btn-outline flex-1 gap-2">
                  🔒 Create Profile to DM
                </button>
              )}
              <button onClick={() => navigate(-1)} className="btn btn-ghost flex-1">
                ← Back
              </button>
            </div>
          )}

          {isOwn && (
            <button onClick={() => navigate('/profile')} className="btn btn-primary btn-sm gap-1 mt-2">
              ✏️ Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
