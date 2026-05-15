import axiosInstance from './axiosInstance';

export const registerUser = async (email, password, role) => {
    const res = await axiosInstance.post('/auth/register/', {
        email,
        password,
        role,
    });
    return res.data;
};

export const loginUser = async (email, password) => {
    const res = await axiosInstance.post('/auth/login/', {
        email,
        password,
    });
    // Save tokens to localStorage
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    localStorage.setItem('role', res.data.role);
    return res.data;
};

export const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    window.location.href = '/login';
};