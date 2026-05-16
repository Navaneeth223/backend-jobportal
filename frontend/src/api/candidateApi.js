import axiosInstance from './axiosInstance';

export const getCandidateProfile = async () => {
    const res = await axiosInstance.get('/candidates/profile/');
    return res.data;
};

export const createCandidateProfile = async (data) => {
    const res = await axiosInstance.post('/candidates/profile/', data);
    return res.data;
};

export const updateCandidateProfile = async (data) => {
    const res = await axiosInstance.put('/candidates/profile/', data);
    return res.data;
};

export const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const res = await axiosInstance.post('/candidates/resume-upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const getSavedJobs = async () => {
    const res = await axiosInstance.get('/candidates/saved-jobs/');
    return res.data;
};

export const saveJob = async (jobId) => {
    const res = await axiosInstance.post(`/candidates/save-job/${jobId}/`);
    return res.data;
};

export const removeSavedJob = async (jobId) => {
    const res = await axiosInstance.delete(`/candidates/save-job/${jobId}/`);
    return res.data;
};

export const addEducation = async (data) => {
    const res = await axiosInstance.post('/candidates/education/', data);
    return res.data;
};

export const removeEducation = async (id) => {
    const res = await axiosInstance.delete(`/candidates/education/${id}/`);
    return res.data;
};

export const addExperience = async (data) => {
    const res = await axiosInstance.post('/candidates/experience/', data);
    return res.data;
};

export const removeExperience = async (id) => {
    const res = await axiosInstance.delete(`/candidates/experience/${id}/`);
    return res.data;
};

export const getJobs = async (filters = {}) => {
    // Construct query parameters from filters object
    const params = new URLSearchParams(filters).toString();
    const url = params ? `/jobs/?${params}` : '/jobs/';
    const res = await axiosInstance.get(url);
    // DRF may return paginated { count, next, previous, results } or just a list
    // We return the raw data and handle it in the component
    return res.data;
};

export const getJobDetail = async (jobId) => {
    const res = await axiosInstance.get(`/jobs/${jobId}/`);
    return res.data;
};

export const getMyApplications = async () => {
    const res = await axiosInstance.get('/candidates/applications/');
    return res.data;
};

export const applyToJob = async (jobId, coverLetter = '', message = '', cvUrl = '') => {
    const payload = {
        job: jobId,
        cover_letter: coverLetter,
        message: message,
        cv_url: cvUrl
    };
    const res = await axiosInstance.post('/candidates/applications/', payload);
    return res.data;
};

export const withdrawApplication = async (applicationId) => {
    const res = await axiosInstance.delete(`/candidates/applications/${applicationId}/`);
    return res.data;
};

export const getNotifications = async (unreadOnly = false) => {
    const res = await axiosInstance.get(`/notifications/?unread=${unreadOnly}`);
    return res.data;
};

export const markNotificationRead = async (notificationId) => {
    const res = await axiosInstance.put(`/notifications/${notificationId}/read/`);
    return res.data;
};

export const markAllNotificationsRead = async () => {
    const res = await axiosInstance.put('/notifications/read-all/');
    return res.data;
};