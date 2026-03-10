import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers, createGroup } from '../api';

const CreateGroupPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers(null, user._id);
        setUsers(data);
      } catch (err) {
        console.error('Fetch users error:', err);
      }
    };
    fetchUsers();
  }, [user._id]);

  const toggleMember = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const group = await createGroup(name.trim(), user._id, selectedMembers, isPrivate);
      navigate(`/group/${group._id}`);
    } catch (err) {
      console.error('Create group error:', err);
      setError(err.response?.data?.message || 'Failed to create group');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-base-200/50 p-4">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl animate-scale-in">
        <div className="card-body gap-5">
          <h1 className="text-2xl font-extrabold">➕ Create Group</h1>

          {error && (
            <div className="alert alert-error text-sm py-2"><span>{error}</span></div>
          )}

          <form className="space-y-4" onSubmit={handleCreate}>
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-semibold">Group Name</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter group name"
                maxLength={50}
                required
                className="input input-bordered w-full focus:outline-none"
              />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="toggle toggle-primary toggle-sm"
                />
                <div>
                  <span className="label-text font-semibold">{isPrivate ? '🔒 Private Group' : '🌐 Public Group'}</span>
                  <p className="text-xs text-base-content/50 mt-0.5">
                    {isPrivate ? 'Users must request to join' : 'Anyone can join this group'}
                  </p>
                </div>
              </label>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-2">Add Members ({selectedMembers.length} selected)</h3>
              <div className="bg-base-200 rounded-xl max-h-60 overflow-y-auto p-2 space-y-1">
                {users.length === 0 ? (
                  <p className="text-center text-base-content/50 text-sm py-4">No users available</p>
                ) : (
                  users.map((u) => (
                    <label
                      key={u._id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                        selectedMembers.includes(u._id) ? 'bg-primary/10' : 'hover:bg-base-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(u._id)}
                        onChange={() => toggleMember(u._id)}
                        className="checkbox checkbox-primary checkbox-sm"
                      />
                      <span className="flex-1 text-sm font-medium">{u.nickname}</span>
                      <span className="text-sm">{u.gender === 'Male' ? '👨' : '👩'}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={creating || !name.trim()}>
              {creating ? <span className="loading loading-spinner loading-sm" /> : null}
              {creating ? 'Creating...' : 'Create Group'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupPage;
