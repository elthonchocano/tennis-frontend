import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthStrategy } from './authStrategies';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [config, setConfig] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [strategy, setStrategy] = useState(null);
    const [user, setUser] = useState(null);

    const decodeUser = (accessToken) => {
        if (!accessToken) return null;
        try {
            const decoded = jwtDecode(accessToken);
            return {
                ...decoded,
                groups: decoded.realm_access?.roles || []
            };
        } catch (e) {
            console.error("Error decodificando token:", e);
            return null;
        }
    };

    useEffect(() => {
        if (token) {
            setUser(decodeUser(token));
        }
    }, [token]);

    useEffect(() => {
        fetch(`/config.json?t=${new Date().getTime()}`)
            .then((res) => res.json())
            .then((data) => {
                setConfig(data);
                setStrategy(getAuthStrategy(data.VITE_AUTH_STRATEGY));
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Configuration load error:", err);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (isLoading || !config || !strategy) return;

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            window.history.replaceState({}, document.title, window.location.origin);
            const redirectUri = window.location.origin + "/";

            const params = new URLSearchParams();
            params.append('grant_type', 'authorization_code');
            params.append('code', code);
            params.append('client_id', config.VITE_AUTH_CLIENT_ID);
            params.append('redirect_uri', redirectUri);

            axios.post(strategy.token(config), params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .then(response => {
                    const { access_token, refresh_token } = response.data;
                    localStorage.setItem('token', access_token);
                    localStorage.setItem('refresh_token', refresh_token);
                    setToken(access_token);
                    setUser(decodeUser(access_token));
                    setIsAuthenticated(true);
                })
                .catch(err => {
                    console.error("DEBUG: Error en el POST:", err.response || err);
                });
        }
    }, [config, isLoading, strategy]);

    const redirectToLogin = () => {
        if (!config) {
            console.error("CRÍTICO: Config es null/undefined");
            return;
        }
        if (!config || !strategy) {
            console.error("Auth: Configuration not loaded yet.");
            return;
        }
        const redirectUri = window.location.origin + "/";
        const loginUrl = `${strategy.authorize(config)}?` + new URLSearchParams({
            client_id: config.VITE_AUTH_CLIENT_ID,
            response_type: "code",
            scope: "openid profile email phone",
            redirect_uri: redirectUri
        }).toString();

        window.location.href = loginUrl;
    };

    const logout = () => {
        if (!config || !strategy) return;
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = strategy.logout(config, window.location.origin + "/");
    };

    if (isLoading) return <div>Loading Application...</div>;

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, redirectToLogin, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);