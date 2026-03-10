import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserGroups, discoverGroups, joinGroupApi, requestJoinGroupApi } from '../api';
import AdBanner from '../components/AdBanner';

const GroupsListPage = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [myData, discoverData] = await Promise.all([
          getUserGroups(user._id),
          discoverGroups(user._id)
        ]);
        setGroups(myData || []);
        setAllGroups(discoverData || []);
      } catch (err) {
        console.error('Fetch groups error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user._id]);

  const handleJoin = async (groupId) => {
    setActionLoading(groupId);
    try {
      await joinGroupApi(groupId, user._id);
      // Refresh data
      const [myData, discoverData] = await Promise.all([
        getUserGroups(user._id),
        discoverGroups(user._id)
      ]);
      setGroups(myData || []);
      setAllGroups(discoverData || []);
    } catch (err) {
      console.error('Join group error:', err);
      alert(err.response?.data?.message || 'Failed to join');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRequestJoin = async (groupId) => {
    setActionLoading(groupId);
    try {
      await requestJoinGroupApi(groupId, user._id);
      const discoverData = await discoverGroups(user._id);
      setAllGroups(discoverData || []);
    } catch (err) {
      console.error('Request join error:', err);
      alert(err.response?.data?.message || 'Failed to send request');
    } finally {
      setActionLoading(null);
    }
  };

  // Groups user is NOT a member of
  const discoverableGroups = allGroups.filter(g => !g.isMember);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200/50">
      <div className="max-w-3xl mx-auto space-y-5 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">🏘️ Groups</h1>
          <Link to="/groups/create" className="btn btn-primary btn-sm gap-1">
            + New Group
          </Link>
        </div>

        {/* Tabs */}
        <div className="join w-full">
          <button
            className={`join-item btn btn-sm flex-1 ${activeTab === 'my' ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
            onClick={() => setActiveTab('my')}
          >
            My Groups ({groups.length})
          </button>
          <button
            className={`join-item btn btn-sm flex-1 ${activeTab === 'discover' ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
            onClick={() => setActiveTab('discover')}
          >
            Discover ({discoverableGroups.length})
          </button>
        </div>

        {activeTab === 'my' ? (
          groups.length === 0 ? (
            <div className="text-center py-20 text-base-content/50">
              <div className="text-5xl mb-3">🏘️</div>
              <p className="font-semibold">No groups yet. Create one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map((group) => (
                <Link to={`/group/${group._id}`} key={group._id} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="card-body flex-row items-center justify-between p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{group.name}</h3>
                        {group.isPrivate && <span className="badge badge-ghost badge-xs">🔒 Private</span>}
                      </div>
                      <p className="text-xs text-base-content/50">
                        Admin: {group.admin?.nickname} · {new Date(group.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="badge badge-primary badge-outline">
                      {group.members?.length || 0} members
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          discoverableGroups.length === 0 ? (
            <div className="text-center py-20 text-base-content/50">
              <div className="text-5xl mb-3">🔍</div>
              <p className="font-semibold">No groups to discover right now</p>
            </div>
          ) : (
            <div className="space-y-3">
              {discoverableGroups.map((group) => (
                <div key={group._id} className="card bg-base-100 shadow-sm">
                  <div className="card-body flex-row items-center justify-between p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{group.name}</h3>
                        {group.isPrivate && <span className="badge badge-ghost badge-xs">🔒 Private</span>}
                      </div>
                      <p className="text-xs text-base-content/50">
                        Admin: {group.admin?.nickname} · {group.members?.length || 0} members
                      </p>
                    </div>
                    <div>
                      {group.hasRequested ? (
                        <span className="badge badge-warning badge-outline badge-sm">⏳ Requested</span>
                      ) : group.isPrivate ? (
                        <button
                          className="btn btn-outline btn-primary btn-sm"
                          onClick={() => handleRequestJoin(group._id)}
                          disabled={actionLoading === group._id}
                        >
                          {actionLoading === group._id ? <span className="loading loading-spinner loading-xs" /> : '🔐 Request Join'}
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleJoin(group._id)}
                          disabled={actionLoading === group._id}
                        >
                          {actionLoading === group._id ? <span className="loading loading-spinner loading-xs" /> : '➕ Join'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        <AdBanner slot="group-chat-top" format="horizontal" className="mt-2 rounded-xl" />
      </div>
    </div>
  );
};

export default GroupsListPage;
