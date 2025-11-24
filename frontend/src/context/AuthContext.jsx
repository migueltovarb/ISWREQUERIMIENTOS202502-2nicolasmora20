import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing stored user:", error);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password, options = { remember: true }) => {
        try {
            // 1. Get Token
            const response = await axios.post('http://localhost:8000/api/token/', {
                username,
                password,
            });

            const { access, refresh } = response.data;

            // 2. Get User Details
            const userResponse = await axios.get('http://localhost:8000/api/users/me/', {
                headers: { Authorization: `Bearer ${access}` }
            });

            const userData = {
                ...userResponse.data,
                access,
                refresh
            };

            setUser(userData);
            const storage = options.remember ? localStorage : sessionStorage;
            storage.setItem('user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            const data = error.response?.data;
            let message = 'Credenciales inválidas';
            if (typeof data === 'string') message = data;
            else if (data?.detail) message = data.detail;
            throw new Error(message);
        }
    };

    const register = async (userData) => {
        try {
            // Optional CSRF fetch for extra protection
            try { await api.get('/csrf/'); } catch {}
            await api.post('/auth/register/', {
                username: userData.email, // Using email as username
                email: userData.email,
                password: userData.password,
                first_name: userData.name,
                role: 'volunteer'
            });
            return true;
        } catch (error) {
            const data = error.response?.data;
            let message = 'Error en el registro';
            if (typeof data === 'string') message = data;
            else if (data?.detail) message = data.detail;
            else if (data && typeof data === 'object') {
                const entries = Object.entries(data);
                if (entries.length) {
                    const parts = entries.map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`);
                    message = parts.join(' | ');
                } else {
                    message = 'Solicitud inválida (400)';
                }
            } else if (error.response) {
                const status = error.response.status;
                message = `Solicitud inválida (${status})`;
            } else if (error.message) {
                message = error.message;
            }
            throw new Error(message);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
