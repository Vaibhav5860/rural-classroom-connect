import axios from 'axios';

const API_BASE = '/api/classes';

export const classAPI = {
  getClassById: async (classId) => {
    return axios.get(`${API_BASE}/${classId}`);
  },

  getAnnouncements: async (classId) => {
    return axios.get(`${API_BASE}/${classId}/announcements`);
  },

  getGlobalAnnouncements: async () => {
    return axios.get('/api/announcements');
  },

  createGlobalAnnouncement: async (data) => {
    return axios.post('/api/announcements', data);
  },

  deleteAnnouncement: async (id) => {
    return axios.delete(`/api/announcements/${id}`);
  },

  createAnnouncement: async (data, classId) => {
    // Backend expects { title, content, important }
    // The route is POST /api/classes/:id/announcements
    return axios.post(`${API_BASE}/${classId}/announcements`, data);
  },

  getLiveStatus: async (classId) => {
    // Placeholder as backend doesn't implement live status yet
    return {
      data: {
        isLive: false,
        scheduledTime: '2024-02-01T10:00:00',
        participants: 0,
      },
    };
  },

  sendChatMessage: async (classId, message) => {
    // Placeholder
    return { data: { success: true, messageId: Date.now().toString() } };
  },

  getChatMessages: async (classId) => {
    // Placeholder
    return {
      data: [],
    };
  },
};
