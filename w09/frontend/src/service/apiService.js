import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, {
            username,
            password
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const verify = async (token) => {
    try{
        const response = await axios.get(`${API_URL}/users/verify`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
    catch (error) {
        throw error.response.data;
    }
}

export const register = async (username, password, role_id) => {
    try {
        const response = await axios.post(`${API_URL}/users/register`, {
            username,
            password,
            role_id
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const getUsers = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/users/list`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}