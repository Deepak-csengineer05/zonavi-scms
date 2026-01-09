import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token) {
                // Optimistically set stored user to avoid flicker
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }

                try {
                    // Fetch fresh profile data
                    const { data } = await authAPI.getProfile();
                    setUser(data);
                    localStorage.setItem('user', JSON.stringify(data));
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    // If 401, clear auth
                    if (error.response?.status === 401) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                    }
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    useEffect(() => {
        // Apply dark mode class
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const login = async (email, password) => {
        const { data } = await authAPI.login({ email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const register = async (userData) => {
        const { data } = await authAPI.register(userData);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            darkMode,
            login,
            register,
            logout,
            updateUser,
            toggleDarkMode,
            isAuthenticated: !!user,
            isAdmin: user?.role === 'admin',
            isEmployer: user?.role === 'employer'
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
