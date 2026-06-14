import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [config, setConfig] = useState(null);

    useEffect(() => {
        const timestamp = new Date().getTime();
        fetch(`/config.json?t=${timestamp}`)
            .then((res) => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then((data) => setConfig(data))
            .catch((err) => console.error("Failed to load config:", err));
    }, []);

    useEffect(() => {
        if (!config) return;

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            window.history.replaceState({}, document.title, window.location.origin);

            const params = new URLSearchParams();
            params.append('grant_type', 'authorization_code');
            params.append('code', code);
            params.append('client_id', config.VITE_AUTH_CLIENT_ID);
            params.append('redirect_uri', window.location.origin);

            axios.post(`${config.VITE_AUTH_SERVER_URL}/protocol/openid-connect/token`, params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .then(response => {
                    const { access_token, refresh_token } = response.data;

                    localStorage.setItem('token', access_token);
                    localStorage.setItem('refresh_token', refresh_token);

                    setToken(access_token);
                    setIsAuthenticated(true);
                })
                .catch(() => { });
        }
    }, [config]);

    const redirectToLogin = () => {
        if (!config) return;
        const loginUrl = `${config.VITE_AUTH_SERVER_URL}/protocol/openid-connect/auth?client_id=${config.VITE_AUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=code&scope=openid%20profile%20offline_access`;
        window.location.href = loginUrl;
    };

    const logout = () => {
        if (!config) return;
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setIsAuthenticated(false);
        window.location.href = `${config.VITE_AUTH_SERVER_URL}/protocol/openid-connect/logout?client_id=${config.VITE_AUTH_CLIENT_ID}&post_logout_redirect_uri=${encodeURIComponent(window.location.origin)}`;
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, redirectToLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);