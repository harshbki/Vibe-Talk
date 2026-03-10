import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserSettings, deleteAccount } from '../api';
import { disconnectSocket } from '../socket';
import { useNavigate } from 'react-router-dom';

const TABS = ['Account', 'Privacy', 'Notifications', 'Appearance'];

const SettingsPage = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Account');
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [gender, setGender] = useState(user?.gender || 'Male');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // Privacy settings
  const [lastSeenVisible, setLastSeenVisible] = useState(user?.privacy?.lastSeenVisible || 'everyone');
  const [profileVisible, setProfileVisible] = useState(user?.privacy?.profileVisible || 'public');

  // Notification settings
  const [notifMessages, setNotifMessages] = useState(user?.notifications?.messages !== false);
  const [notifMatches, setNotifMatches] = useState(user?.notifications?.matches !== false);
  const [notifGroups, setNotifGroups] = useState(user?.notifications?.groups !== false);

  // Local preferences (stored in localStorage)
  const [chatSound, setChatSound] = useState(() => localStorage.getItem('vt_chatSound') !== 'false');
  const [compactMode, setCompactMode] = useState(() => localStorage.getItem('vt_compactMode') === 'true');
  const [enterToSend, setEnterToSend] = useState(() => localStorage.getItem('vt_enterToSend') !== 'false');

  useEffect(() => {
    localStorage.setItem('vt_chatSound', chatSound);
    localStorage.setItem('vt_compactMode', compactMode);
    localStorage.setItem('vt_enterToSend', enterToSend);
  }, [chatSound, compactMode, enterToSend]);

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    setSaving(true);
    try {
      const updated = await updateUserSettings(user._id, { nickname: nickname.trim(), gender });
      setUser({ ...user, ...updated });
      showMsg('success', 'Account settings saved!');
    } catch (err) {
      console.error('Settings save error:', err);
      showMsg('error', err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    setSaving(true);
    try {
      const updated = await updateUserSettings(user._id, {
        privacy: { lastSeenVisible, profileVisible }
      });
      setUser({ ...user, ...updated });
      showMsg('success', 'Privacy settings saved!');
    } catch (err) {
      console.error('Privacy save error:', err);
      showMsg('error', 'Failed to save privacy settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      const updated = await updateUserSettings(user._id, {
        notifications: { messages: notifMessages, matches: notifMatches, groups: notifGroups }
      });
      setUser({ ...user, ...updated });
      showMsg('success', 'Notification preferences saved!');
    } catch (err) {
      console.error('Notification save error:', err);
      showMsg('error', 'Failed to save notification settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure? This will permanently delete your account and all data.')) return;
    try {
      await deleteAccount(user._id);
      disconnectSocket();
      logout();
      navigate('/');
    } catch (err) {
      console.error('Delete account error:', err);
      showMsg('error', 'Failed to delete account');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200/50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-5">
        <h1 className="text-2xl font-extrabold">⚙️ Settings</h1>

        {msg && (
          <div className={`alert ${msg.type === 'error' ? 'alert-error' : 'alert-success'} text-sm py-2`}>
            <span>{msg.text}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs tabs-boxed bg-base-100 p-1">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`tab tab-sm flex-1 ${activeTab === tab ? 'tab-active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Account' && '👤 '}
              {tab === 'Privacy' && '🔒 '}
              {tab === 'Notifications' && '🔔 '}
              {tab === 'Appearance' && '🎨 '}
              {tab}
            </button>
          ))}
        </div>

        {/* Account Tab */}
        {activeTab === 'Account' && (
          <div className="space-y-5">
            <div className="card bg-base-100 shadow-md">
              <div className="card-body gap-4">
                <h2 className="card-title text-base">👤 Account Settings</h2>
                <form className="space-y-4" onSubmit={handleSaveAccount}>
                  <div className="form-control w-full">
                    <label className="label"><span className="label-text font-medium">Nickname</span></label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      maxLength={20}
                      required
                      className="input input-bordered w-full focus:outline-none focus:input-primary"
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label"><span className="label-text font-medium">Gender</span></label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`btn btn-outline ${gender === 'Male' ? 'btn-primary' : 'btn-ghost border-base-300'} gap-2`}>
                        <input type="radio" name="gender" value="Male" checked={gender === 'Male'} onChange={(e) => setGender(e.target.value)} className="hidden" />
                        👨 Male
                      </label>
                      <label className={`btn btn-outline ${gender === 'Female' ? 'btn-secondary' : 'btn-ghost border-base-300'} gap-2`}>
                        <input type="radio" name="gender" value="Female" checked={gender === 'Female'} onChange={(e) => setGender(e.target.value)} className="hidden" />
                        👩 Female
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-full" disabled={saving}>
                    {saving ? <span className="loading loading-spinner loading-sm" /> : 'Save Changes'}
                  </button>
                </form>
              </div>
            </div>

            {/* Chat Preferences */}
            <div className="card bg-base-100 shadow-md">
              <div className="card-body gap-3">
                <h2 className="card-title text-base">💬 Chat Preferences</h2>
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input type="checkbox" checked={chatSound} onChange={(e) => setChatSound(e.target.checked)} className="toggle toggle-primary toggle-sm" />
                    <div>
                      <span className="label-text font-medium">Message sounds</span>
                      <p className="text-xs text-base-content/50">Play a sound when you receive a message</p>
                    </div>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input type="checkbox" checked={enterToSend} onChange={(e) => setEnterToSend(e.target.checked)} className="toggle toggle-primary toggle-sm" />
                    <div>
                      <span className="label-text font-medium">Enter to send</span>
                      <p className="text-xs text-base-content/50">Press Enter to send messages</p>
                    </div>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input type="checkbox" checked={compactMode} onChange={(e) => setCompactMode(e.target.checked)} className="toggle toggle-primary toggle-sm" />
                    <div>
                      <span className="label-text font-medium">Compact mode</span>
                      <p className="text-xs text-base-content/50">Reduce spacing in chat messages</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="card bg-base-100 shadow-md border border-error/20">
              <div className="card-body gap-3">
                <h2 className="card-title text-base text-error">⚠️ Danger Zone</h2>
                <p className="text-sm text-base-content/60">
                  Deleting your account is permanent. All your messages, chats, and groups will be removed.
                </p>
                <button className="btn btn-error btn-outline w-full" onClick={handleDelete}>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'Privacy' && (
          <div className="space-y-5">
            <div className="card bg-base-100 shadow-md">
              <div className="card-body gap-4">
                <h2 className="card-title text-base">🔒 Privacy Settings</h2>

                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-medium">Last Seen</span></label>
                  <p className="text-xs text-base-content/50 mb-2">Who can see when you were last online?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`btn btn-sm ${lastSeenVisible === 'everyone' ? 'btn-primary' : 'btn-outline btn-ghost'}`}>
                      <input type="radio" name="lastSeen" value="everyone" checked={lastSeenVisible === 'everyone'} onChange={(e) => setLastSeenVisible(e.target.value)} className="hidden" />
                      Everyone
                    </label>
                    <label className={`btn btn-sm ${lastSeenVisible === 'nobody' ? 'btn-primary' : 'btn-outline btn-ghost'}`}>
                      <input type="radio" name="lastSeen" value="nobody" checked={lastSeenVisible === 'nobody'} onChange={(e) => setLastSeenVisible(e.target.value)} className="hidden" />
                      Nobody
                    </label>
                  </div>
                </div>

                <div className="divider my-1" />

                <div className="form-control w-full">
                  <label className="label"><span className="label-text font-medium">Profile Visibility</span></label>
                  <p className="text-xs text-base-content/50 mb-2">Who can view your full profile?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`btn btn-sm ${profileVisible === 'public' ? 'btn-primary' : 'btn-outline btn-ghost'}`}>
                      <input type="radio" name="profileVis" value="public" checked={profileVisible === 'public'} onChange={(e) => setProfileVisible(e.target.value)} className="hidden" />
                      🌐 Public
                    </label>
                    <label className={`btn btn-sm ${profileVisible === 'private' ? 'btn-primary' : 'btn-outline btn-ghost'}`}>
                      <input type="radio" name="profileVis" value="private" checked={profileVisible === 'private'} onChange={(e) => setProfileVisible(e.target.value)} className="hidden" />
                      🔒 Private
                    </label>
                  </div>
                </div>

                <button onClick={handleSavePrivacy} disabled={saving} className="btn btn-primary w-full mt-2">
                  {saving ? <span className="loading loading-spinner loading-sm" /> : 'Save Privacy Settings'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'Notifications' && (
          <div className="space-y-5">
            <div className="card bg-base-100 shadow-md">
              <div className="card-body gap-4">
                <h2 className="card-title text-base">🔔 Notification Preferences</h2>
                <p className="text-xs text-base-content/50">Choose which notifications you want to receive.</p>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input type="checkbox" checked={notifMessages} onChange={(e) => setNotifMessages(e.target.checked)} className="toggle toggle-primary toggle-sm" />
                    <div>
                      <span className="label-text font-medium">Messages</span>
                      <p className="text-xs text-base-content/50">New private messages</p>
                    </div>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input type="checkbox" checked={notifMatches} onChange={(e) => setNotifMatches(e.target.checked)} className="toggle toggle-secondary toggle-sm" />
                    <div>
                      <span className="label-text font-medium">Matches</span>
                      <p className="text-xs text-base-content/50">Random match found</p>
                    </div>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input type="checkbox" checked={notifGroups} onChange={(e) => setNotifGroups(e.target.checked)} className="toggle toggle-accent toggle-sm" />
                    <div>
                      <span className="label-text font-medium">Groups</span>
                      <p className="text-xs text-base-content/50">Group activity notifications</p>
                    </div>
                  </label>
                </div>

                <button onClick={handleSaveNotifications} disabled={saving} className="btn btn-primary w-full mt-2">
                  {saving ? <span className="loading loading-spinner loading-sm" /> : 'Save Notification Settings'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'Appearance' && (
          <div className="space-y-5">
            <div className="card bg-base-100 shadow-md">
              <div className="card-body gap-4">
                <h2 className="card-title text-base">🎨 Theme</h2>
                <p className="text-sm text-base-content/60">Choose your preferred appearance.</p>
                <div className="grid grid-cols-3 gap-3">
                  {[{ value: 'light', label: '☀️ Light' }, { value: 'dark', label: '🌙 Dark' }, { value: 'system', label: '💻 System' }].map(opt => (
                    <button
                      key={opt.value}
                      className={`btn btn-sm ${localStorage.getItem('theme') === opt.value ? 'btn-primary' : 'btn-outline btn-ghost'}`}
                      onClick={() => {
                        localStorage.setItem('theme', opt.value);
                        const resolved = opt.value === 'system'
                          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                          : opt.value;
                        document.documentElement.setAttribute('data-theme', resolved);
                        window.dispatchEvent(new Event('theme-change'));
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-md">
              <div className="card-body gap-3">
                <h2 className="card-title text-base">ℹ️ About</h2>
                <div className="text-sm text-base-content/60 space-y-1">
                  <p><span className="font-medium text-base-content">Vibe Talk</span> — Real-time anonymous chat &amp; dating</p>
                  <p>Version 1.0.0</p>
                  <p>Features: Chat, Random Match, Groups, Video Calls, Notifications</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
