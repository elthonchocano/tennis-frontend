import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    const authServerUrl = import.meta.env.VITE_AUTH_SERVER_URL;
    const clientId = import.meta.env.VITE_AUTH_CLIENT_ID;

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            window.history.replaceState({}, document.title, window.location.origin);

            const params = new URLSearchParams();
            params.append('grant_type', 'authorization_code');
            params.append('code', code);
            params.append('client_id', clientId);
            params.append('redirect_uri', window.location.origin);

            axios.post(`${authServerUrl}/protocol/openid-connect/token`, params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .then(response => {
                    const { access_token, refresh_token } = response.data;

                    localStorage.setItem('token', access_token);
                    localStorage.setItem('refresh_token', refresh_token);

                    setToken(access_token);
                    setIsAuthenticated(true);
                })
                .catch(() => {});
        }
    }, [clientId, authServerUrl]);

    const redirectToLogin = () => {
        const loginUrl = `${authServerUrl}/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=code&scope=openid%20profile%20offline_access`;
        window.location.href = loginUrl;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setIsAuthenticated(false);
        window.location.href = `${authServerUrl}/protocol/openid-connect/logout?client_id=${clientId}&post_logout_redirect_uri=${encodeURIComponent(window.location.origin)}`;
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, redirectToLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);