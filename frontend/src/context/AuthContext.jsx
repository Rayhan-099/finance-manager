/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    // Axios default configuration
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['x-auth-token'] = token;
            localStorage.setItem('token', token);
            fetchUser();
        } else {
            delete axios.defaults.headers.common['x-auth-token'];
            localStorage.removeItem('token');
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const res = await axios.get('/api/auth/me');
            setUser(res.data);
        } catch (err) {
            console.error(err);
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            setToken(res.data.token);
        } catch (err) {
            console.error('Login error:', err.response?.data || err.message);
            throw err;
        }
    };

    const signup = async (name, email, password) => {
        try {
            const res = await axios.post('/api/auth/register', { name, email, password });
            setToken(res.data.token);
        } catch (err) {
            console.error('Signup error:', err.response?.data || err.message);
            throw err;
        }
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};
