import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { completeProfile, updateProfile, uploadProfilePicture } from '../api';
import AdBanner from '../components/AdBanner';

const INTEREST_OPTIONS = [
  'Music', 'Gaming', 'Travel', 'Movies', 'Sports', 'Cooking',
  'Reading', 'Photography', 'Fitness', 'Art', 'Tech', 'Fashion'
];

const ProfilePage = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isNewUser = !user?.isFullAccount;
  const [step, setStep] = useState(1);
  const [isEditing, setIsEditing] = useState(isNewUser);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    location: user?.location || '',
    interests: user?.interests || []
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!user) {
    navigate('/');
    return null;
  }

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : prev.interests.length < 5
          ? [...prev.interests, interest]
          : prev.interests
    }));
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const response = await uploadProfilePicture(user._id, file);
      setUser(response.user);
      if (!isNewUser) showToast('Profile picture updated!');
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to upload picture', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (isNewUser && !formData.fullName.trim()) {
      showToast('Full name is required', 'error');
      return;
    }
    if (isNewUser && !formData.dateOfBirth) {
      showToast('Date of birth is required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        bio: formData.bio.trim(),
        location: formData.location.trim(),
        interests: formData.interests
      };
      if (formData.dateOfBirth) {
        payload.dateOfBirth = formData.dateOfBirth;
      }
      const apiFn = isNewUser ? completeProfile : updateProfile;
      const updatedUser = await apiFn(user._id, payload);
      setUser(updatedUser);
      setIsEditing(false);
      if (isNewUser) {
        const target = location.state?.from && location.state.from !== '/profile'
          ? location.state.from
          : '/chat';
        navigate(target, { replace: true });
      } else {
        showToast('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Save error:', error);
      showToast('Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  };

  // ── New-user step wizard ──
  if (isNewUser) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-base-200/50 flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-xl w-full max-w-md">
          <div className="card-body">
            {/* Progress bar */}
            <div className="flex gap-1 mb-4">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-base-300'}`} />
              ))}
            </div>

            {/* Step 1: Basic info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="alert alert-warning text-sm py-2">
                  <span>Complete your profile to continue using VibeTalk.</span>
                </div>
                <div className="text-center mb-2">
                  <div className="text-4xl mb-2">👋</div>
                  <h2 className="text-xl font-extrabold">Welcome, {user.nickname}!</h2>
                  <p className="text-sm text-base-content/60 mt-1">Set up your profile to get started</p>
                </div>

                {/* Avatar */}
                <div className="flex justify-center">
                  <div className="relative">
                    {user.profilePicture ? (
                      <div className="avatar">
                        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          <img src={user.profilePicture} alt="Profile" />
                        </div>
                      </div>
                    ) : (
                      <div className="avatar placeholder">
                        <div className={`w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 ${user.gender === 'Male' ? 'bg-primary/15 text-primary' : 'bg-secondary/15 text-secondary'}`}>
                          <span className="text-3xl font-bold">{user.nickname?.charAt(0).toUpperCase()}</span>
                        </div>
                      </div>
                    )}
                    <label className="btn btn-circle btn-sm btn-primary absolute -bottom-1 -right-1 cursor-pointer shadow-md">
                      {uploading ? <span className="loading loading-spinner loading-xs" /> : '📷'}
                      <input type="file" accept="image/*" onChange={handlePictureUpload} disabled={uploading} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold">Full Name <span className="text-error">*</span></span></label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Your real name"
                    className="input input-bordered w-full focus:outline-none focus:input-primary"
                    maxLength={50}
                  />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold">Bio</span></label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell people about yourself..."
                    rows="2"
                    maxLength={150}
                    className="textarea textarea-bordered w-full focus:outline-none focus:textarea-primary"
                  />
                  <label className="label"><span className="label-text-alt text-base-content/40">{formData.bio.length}/150</span></label>
                </div>

                <button onClick={() => setStep(2)} disabled={!formData.fullName.trim()} className="btn btn-primary w-full">
                  Next →
                </button>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-2">
                  <div className="text-4xl mb-2">📋</div>
                  <h2 className="text-xl font-extrabold">A few more details</h2>
                  <p className="text-sm text-base-content/60 mt-1">Optional but helps you connect better</p>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold">Date of Birth <span className="text-error">*</span></span></label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
                    className="input input-bordered w-full focus:outline-none focus:input-primary"
                  />
                  {formData.dateOfBirth && (
                    <label className="label"><span className="label-text-alt text-base-content/50">Age: {calculateAge(formData.dateOfBirth)}</span></label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold">Location</span></label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                    className="input input-bordered w-full focus:outline-none focus:input-primary"
                    maxLength={50}
                  />
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setStep(1)} className="btn btn-ghost flex-1">← Back</button>
                  <button onClick={() => setStep(3)} disabled={!formData.dateOfBirth} className="btn btn-primary flex-1">Next →</button>
                </div>
              </div>
            )}

            {/* Step 3: Interests */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-2">
                  <div className="text-4xl mb-2">🎯</div>
                  <h2 className="text-xl font-extrabold">Pick your interests</h2>
                  <p className="text-sm text-base-content/60 mt-1">Select up to 5</p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {INTEREST_OPTIONS.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleToggleInterest(interest)}
                      className={`badge badge-lg cursor-pointer transition-all ${
                        formData.interests.includes(interest)
                          ? 'badge-primary shadow-sm'
                          : 'badge-outline hover:badge-primary/20'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setStep(2)} className="btn btn-ghost flex-1">← Back</button>
                  <button onClick={handleSave} disabled={saving} className="btn btn-primary flex-1">
                    {saving ? <span className="loading loading-spinner loading-sm" /> : '✅ Start Chatting'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="toast toast-top toast-end z-50">
            <div className={`alert ${toast.type === 'error' ? 'alert-error' : 'alert-success'} text-sm shadow-lg`}>
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Existing user profile view ──
  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200/50 p-4 md:p-6">
      <div className="max-w-lg mx-auto space-y-5">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center gap-5">
            {/* Avatar */}
            <div className="relative group">
              {user.profilePicture ? (
                <div className="avatar">
                  <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={user.profilePicture} alt="Profile" />
                  </div>
                </div>
              ) : (
                <div className="avatar placeholder">
                  <div className={`w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 ${user.gender === 'Male' ? 'bg-primary/15 text-primary' : 'bg-secondary/15 text-secondary'}`}>
                    <span className="text-4xl font-bold">{user.nickname?.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              )}
              <label className="btn btn-circle btn-sm btn-primary absolute -bottom-1 -right-1 text-sm cursor-pointer shadow-md">
                {uploading ? <span className="loading loading-spinner loading-xs" /> : '📷'}
                <input type="file" accept="image/*" onChange={handlePictureUpload} disabled={uploading} className="hidden" />
              </label>
            </div>

            <div>
              <h2 className="text-xl font-extrabold">{user.nickname}</h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className={`badge ${user.gender === 'Male' ? 'badge-primary' : 'badge-secondary'} badge-outline gap-1`}>
                  {user.gender === 'Male' ? '👨' : '👩'} {user.gender}
                </span>
                <span className="badge badge-success badge-outline badge-sm">✅ Complete</span>
              </div>
            </div>

            {isEditing ? (
              <div className="w-full space-y-4 mt-2">
                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-semibold">Full Name</span></label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    maxLength={50}
                    className="input input-bordered w-full focus:outline-none focus:input-primary"
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-semibold">Bio</span></label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    rows="2"
                    maxLength={150}
                    className="textarea textarea-bordered w-full focus:outline-none focus:textarea-primary"
                  />
                  <label className="label"><span className="label-text-alt text-base-content/40">{formData.bio.length}/150</span></label>
                </div>
                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-semibold">Date of Birth</span></label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
                    className="input input-bordered w-full focus:outline-none focus:input-primary"
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-semibold">Location</span></label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                    maxLength={50}
                    className="input input-bordered w-full focus:outline-none focus:input-primary"
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-semibold">Interests <span className="text-base-content/40 font-normal">(up to 5)</span></span></label>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map(interest => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleToggleInterest(interest)}
                        className={`badge badge-lg cursor-pointer transition-all ${
                          formData.interests.includes(interest)
                            ? 'badge-primary shadow-sm'
                            : 'badge-outline hover:badge-primary/20'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 w-full">
                  <button onClick={handleSave} disabled={saving} className="btn btn-primary flex-1">
                    {saving ? <span className="loading loading-spinner loading-xs" /> : '✅ Save'}
                  </button>
                  <button onClick={() => setIsEditing(false)} disabled={saving} className="btn btn-ghost flex-1">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full space-y-3 mt-2">
                {user.fullName && <p className="font-semibold text-lg">{user.fullName}</p>}
                {user.bio && <p className="text-base-content/70 text-sm">{user.bio}</p>}
                <div className="flex flex-col gap-1 text-sm text-base-content/50">
                  {user.dateOfBirth && <span>🎂 Age: {calculateAge(user.dateOfBirth)}</span>}
                  {user.location && <span>📍 {user.location}</span>}
                  <span>📹 Video calls used: {user.freeCallsUsed || 0}</span>
                </div>
                {user.interests && user.interests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {user.interests.map(interest => (
                      <span key={interest} className="badge badge-primary badge-outline badge-sm">{interest}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 w-full pt-2">
                  <button onClick={() => setIsEditing(true)} className="btn btn-primary btn-sm flex-1 gap-1">
                    ✏️ Edit Profile
                  </button>
                  <button onClick={() => { logout(); navigate('/'); }} className="btn btn-error btn-outline btn-sm flex-1 gap-1">
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ad Banner */}
      <AdBanner slot="profile-bottom" format="auto" className="mt-4 max-w-lg mx-auto rounded-xl" />

      {/* Toast */}
      {toast && (
        <div className="toast toast-top toast-end z-50">
          <div className={`alert ${toast.type === 'error' ? 'alert-error' : 'alert-success'} text-sm shadow-lg`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
