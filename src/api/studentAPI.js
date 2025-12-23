import axios from './client';

const API_BASE = '/api/student';

export const studentAPI = {
  getDashboard: async () => {
    return axios.get(`${API_BASE}/dashboard`);
  },

  getEnrolledClasses: async () => {
    return axios.get(`${API_BASE}/classes`);
  },

  getAllAssignments: async () => {
    return axios.get(`${API_BASE}/assignments`);
  },

  joinClass: async (classCode) => {
    return axios.post(`${API_BASE}/join`, { classCode });
  },

  getMaterials: async (classId) => {
    return axios.get(`/api/materials/${classId}`);
  },

  getAssignments: async (classId) => {
    return axios.get(`/api/assignments/class/${classId}`);
  },

  submitAssignment: async (assignmentId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`/api/assignments/${assignmentId}/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getAttendance: async () => {
    return axios.get('/api/attendance/student');
  },

  joinLiveClass: async (classId) => {
    // Placeholder
    return { data: { success: true, roomId: `room-${classId}` } };
  },

  raiseHand: async (classId) => {
    // Placeholder
    return { data: { success: true } };
  },
};
