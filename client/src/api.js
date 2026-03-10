import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const guestLogin = async (nickname, gender) => {
  const response = await api.post('/auth/guest', { nickname, gender });
  return response.data;
};

export const profileLoginApi = async (nickname, fullName, dateOfBirth) => {
  const response = await api.post('/auth/profile-login', { nickname, fullName, dateOfBirth });
  return response.data;
};

export const getUser = async (userId) => {
  const response = await api.get(`/auth/user/${userId}`);
  return response.data;
};

export const getUsers = async (gender, excludeId) => {
  const params = new URLSearchParams();
  if (gender) params.append('gender', gender);
  if (excludeId) params.append('excludeId', excludeId);
  const response = await api.get(`/users?${params.toString()}`);
  return response.data;
};

export const uploadMedia = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
};

// Profile API
export const getProfile = async (userId) => {
  const response = await api.get(`/profile/${userId}`);
  return response.data;
};

export const updateProfile = async (userId, data) => {
  const response = await api.put(`/profile/${userId}`, data);
  return response.data;
};

export const completeProfile = async (userId, data) => {
  const response = await api.post(`/profile/${userId}/complete`, data);
  return response.data;
};

export const uploadProfilePicture = async (userId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/profile/${userId}/picture`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Settings API
export const updateUserSettings = async (userId, data) => {
  const response = await api.put('/users/update', { userId, ...data });
  return response.data;
};

export const deleteAccount = async (userId) => {
  const response = await api.delete('/users/delete', { data: { userId } });
  return response.data;
};

// Notification API
export const getNotifications = async (userId) => {
  const response = await api.get(`/notifications/${userId}`);
  return response.data;
};

export const getUnreadNotificationCount = async (userId) => {
  const response = await api.get(`/notifications/${userId}/unread-count`);
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async (userId) => {
  const response = await api.put(`/notifications/${userId}/read-all`);
  return response.data;
};

// Group API
export const createGroup = async (name, adminId, memberIds, isPrivate = false) => {
  const response = await api.post('/groups', { name, adminId, memberIds, isPrivate });
  return response.data;
};

export const getUserGroups = async (userId) => {
  const response = await api.get(`/groups/user/${userId}`);
  return response.data;
};

export const getGroupById = async (groupId) => {
  const response = await api.get(`/groups/${groupId}`);
  return response.data;
};

export const addGroupMember = async (groupId, userId, requesterId) => {
  const response = await api.post(`/groups/${groupId}/add-member`, { userId, requesterId });
  return response.data;
};

export const removeGroupMember = async (groupId, userId, requesterId) => {
  const response = await api.post(`/groups/${groupId}/remove-member`, { userId, requesterId });
  return response.data;
};

export const deleteGroupApi = async (groupId, requesterId) => {
  const response = await api.delete(`/groups/${groupId}`, { data: { requesterId } });
  return response.data;
};

export const discoverGroups = async (userId) => {
  const response = await api.get(`/groups/discover?userId=${userId}`);
  return response.data;
};

export const joinGroupApi = async (groupId, userId) => {
  const response = await api.post(`/groups/${groupId}/join`, { userId });
  return response.data;
};

export const requestJoinGroupApi = async (groupId, userId) => {
  const response = await api.post(`/groups/${groupId}/request-join`, { userId });
  return response.data;
};

export const approveJoinRequestApi = async (groupId, userId, requesterId) => {
  const response = await api.post(`/groups/${groupId}/approve-join`, { userId, requesterId });
  return response.data;
};

export const rejectJoinRequestApi = async (groupId, userId, requesterId) => {
  const response = await api.post(`/groups/${groupId}/reject-join`, { userId, requesterId });
  return response.data;
};

// Chat API
export const getOrCreateChat = async (userId1, userId2) => {
  const response = await api.post('/chat', { userId1, userId2 });
  return response.data;
};

export const getChatMessages = async (chatId, page = 1) => {
  const response = await api.get(`/chat/${chatId}/messages?page=${page}`);
  return response.data;
};

export const getUserChats = async (userId) => {
  const response = await api.get(`/chat/user/${userId}`);
  return response.data;
};

export const deleteMessageApi = async (messageId, userId) => {
  const response = await api.delete(`/chat/messages/${messageId}`, { data: { userId } });
  return response.data;
};

export default api;
