export const TokenService = {
    setTokens(accessToken: string, refreshToken: string, rememberMe: boolean) {
        if (rememberMe) {
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("refreshToken");
        } else {
            sessionStorage.setItem("accessToken", accessToken);
            sessionStorage.setItem("refreshToken", refreshToken);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }
    },

    getAccessToken(): string | null {
        return localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    },

    getRefreshToken(): string | null {
        return localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
    },

    clearTokens() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
    },

    setUser(user: any, rememberMe?: boolean) {
        // If rememberMe is not provided, try to infer from where tokens are stored
        const isPersistent = rememberMe ?? !!localStorage.getItem("accessToken");

        const userStr = JSON.stringify(user);
        if (isPersistent) {
            localStorage.setItem("user", userStr);
            sessionStorage.removeItem("user");
        } else {
            sessionStorage.setItem("user", userStr);
            localStorage.removeItem("user");
        }
    },

    getUser(): any | null {
        const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    },

    // Helper to know if we are in "remember me" mode
    isPersistentSession(): boolean {
        return !!localStorage.getItem("accessToken");
    }
};
