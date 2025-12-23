import axios from 'axios';

const API_BASE = '/api/teacher';

export const teacherAPI = {
  getDashboard: async () => {
    return axios.get(`${API_BASE}/dashboard`);
  },

  createClass: async (data) => {
    return axios.post('/api/classes', data);
  },

  getClasses: async () => {
    return axios.get('/api/classes?teacher=me');
  },

  deleteClass: async (id) => {
    return axios.delete(`/api/classes/${id}`);
  },

  updateClass: async (id, data) => {
    return axios.put(`/api/classes/${id}`, data);
  },

  uploadMaterial: async (classId, file, title, description) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    if (description) formData.append('description', description);

    return axios.post(`/api/materials/${classId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getMaterials: async (classId) => {
    return axios.get(`/api/materials/${classId}`);
  },

  createAssignment: async (data) => {
    // data can contain file if we decide to allow attachments for assignment descriptions
    // For now assuming simple JSON creation
    return axios.post('/api/assignments', data);
  },

  getAllAssignments: async () => {
    return axios.get('/api/teacher/assignments');
  },

  getAssignments: async (classId) => {
    return axios.get(`/api/assignments/class/${classId}`);
  },

  getSubmissions: async (assignmentId) => {
    return axios.get(`/api/assignments/${assignmentId}/submissions`);
  },

  gradeSubmission: async (submissionId, grade, feedback) => {
    return axios.put(`/api/assignments/submission/${submissionId}`, { grade, feedback });
  },

  startLiveClass: async (classId) => {
    // Placeholder
    return { data: { success: true, roomId: `room-${classId}` } };
  },

  markAttendance: async (data) => {
    return axios.post('/api/attendance', data);
  },

  getClassAttendance: async (classId, date) => {
    let url = `/api/attendance/class/${classId}`;
    if (date) {
      url += `?date=${date}`;
    }
    return axios.get(url);
  },

  getClassStudents: async (classId) => {
    const response = await axios.get(`/api/classes/${classId}`);
    // Return accessing students array from the class object
    return { data: response.data.students };
  }
};
