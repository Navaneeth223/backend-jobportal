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