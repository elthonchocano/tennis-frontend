import axios from 'axios';

let configPromise = null;

const getApiConfig = async () => {
    if (!configPromise) {
        // Añadimos un timestamp para evitar que el navegador cachee el archivo
        const timestamp = new Date().getTime();
        configPromise = fetch(`/config.json?t=${timestamp}`)
            .then((res) => res.json())
            .catch(() => ({
                VITE_API_BASE_URL: '',
                VITE_AUTH_SERVER_URL: '',
                VITE_AUTH_CLIENT_ID: ''
            }));
    }
    return configPromise;
};

const api = axios.create({
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    async (config) => {
        const appConfig = await getApiConfig();
        config.baseURL = appConfig.VITE_API_BASE_URL;

        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh_token');
            const appConfig = await getApiConfig();
            const authServerUrl = appConfig.VITE_AUTH_SERVER_URL;
            const clientId = appConfig.VITE_AUTH_CLIENT_ID;

            if (refreshToken) {
                try {
                    const params = new URLSearchParams();
                    params.append('grant_type', 'refresh_token');
                    params.append('refresh_token', refreshToken);
                    params.append('client_id', clientId);

                    const tokenResponse = await axios.post(
                        `${authServerUrl}/protocol/openid-connect/token`,
                        params,
                        {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Authorization': ''
                            }
                        }
                    );

                    const { access_token, refresh_token: newRefreshToken } = tokenResponse.data;

                    localStorage.setItem('token', access_token);

                    if (newRefreshToken) {
                        localStorage.setItem('refresh_token', newRefreshToken);
                    }

                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return api(originalRequest);

                } catch (refreshError) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refresh_token');
                    window.location.reload();
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;