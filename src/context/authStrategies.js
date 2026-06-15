export const authStrategies = {
    cognito: {
        authorize: (config) => `${config.VITE_AUTH_SERVER_URL}/login`,
        token: (config) => `${config.VITE_AUTH_SERVER_URL}/oauth2/token`,
        logout: (config, redirectUri) =>
            `${config.VITE_AUTH_SERVER_URL}/logout?client_id=${config.VITE_AUTH_CLIENT_ID}&logout_uri=${encodeURIComponent(redirectUri)}`
    },
    oidc: {
        authorize: (config) => `${config.VITE_AUTH_SERVER_URL}/protocol/openid-connect/auth`,
        token: (config) => `${config.VITE_AUTH_SERVER_URL}/protocol/openid-connect/token`,
        logout: (config, redirectUri) =>
            `${config.VITE_AUTH_SERVER_URL}/protocol/openid-connect/logout?client_id=${config.VITE_AUTH_CLIENT_ID}&post_logout_redirect_uri=${encodeURIComponent(redirectUri)}`
    }
};

export const getAuthStrategy = (strategyName) => {
    const strategy = authStrategies[strategyName];
    if (!strategy) throw new Error(`Provider ${strategyName} not found`);
    return strategy;
};