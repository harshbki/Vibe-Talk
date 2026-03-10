import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { completeProfile, uploadProfilePicture } from '../api';

const INTEREST_OPTIONS = [
  'Music', 'Gaming', 'Travel', 'Movies', 'Sports', 'Cooking',
  'Reading', 'Photography', 'Fitness', 'Art', 'Tech', 'Fashion'
];

const ProfileCompletionModal = () => {
  const { user, setUser } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    dateOfBirth: '',
    location: '',
    interests: []
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.isFullAccount) return;
  }, [user]);

  if (!user || user.isFullAccount) return null;

  const handleChange = (e) => {
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
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload picture');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }
    setSaving(true);
    setError('');
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
      const updatedUser = await completeProfile(user._id, payload);
      setUser(updatedUser);
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  };

  return (
    <div className="modal modal-open z-[100]">
      <div className="modal-box max-w-md relative">
        {/* Progress */}
        <div className="flex gap-1 mb-5">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-base-300'}`} />
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">👋</div>
              <h3 className="text-xl font-extrabold">Welcome, {user.nickname}!</h3>
              <p className="text-sm text-base-content/60 mt-1">Complete your profile to get started</p>
            </div>

            {/* Avatar upload */}
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
                onChange={handleChange}
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
                onChange={handleChange}
                placeholder="Tell people about yourself..."
                rows="2"
                maxLength={150}
                className="textarea textarea-bordered w-full focus:outline-none focus:textarea-primary"
              />
              <label className="label"><span className="label-text-alt text-base-content/40">{formData.bio.length}/150</span></label>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!formData.fullName.trim()}
              className="btn btn-primary w-full"
            >
              Next →
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">📋</div>
              <h3 className="text-xl font-extrabold">A few more details</h3>
              <p className="text-sm text-base-content/60 mt-1">These are optional but help you connect better</p>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Date of Birth</span></label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
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
                onChange={handleChange}
                placeholder="City, Country"
                className="input input-bordered w-full focus:outline-none focus:input-primary"
                maxLength={50}
              />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="btn btn-ghost flex-1">← Back</button>
              <button onClick={() => setStep(3)} className="btn btn-primary flex-1">Next →</button>
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="text-xl font-extrabold">Pick your interests</h3>
              <p className="text-sm text-base-content/60 mt-1">Select up to 5 interests</p>
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

            {error && <p className="text-error text-sm text-center">{error}</p>}

            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="btn btn-ghost flex-1">← Back</button>
              <button onClick={handleSave} disabled={saving} className="btn btn-primary flex-1">
                {saving ? <span className="loading loading-spinner loading-sm" /> : '✅ Continue to VibeTalk'}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="modal-backdrop bg-black/50" />
    </div>
  );
};

export default ProfileCompletionModal;
