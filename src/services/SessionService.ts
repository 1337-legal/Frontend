class SessionService {
    public setToken(data: string) {
        localStorage.setItem("token", data);
    }

    public setUser(data: { displayName: string; role: string }) {
        localStorage.setItem("user", JSON.stringify(data));
    }

    public getToken(): string | null {
        return localStorage.getItem("token");
    }

    public getUser(): {
        displayName: string;
        role: string;
    } | null {
        return JSON.parse(localStorage.getItem("user") as string) as {
            displayName: string;
            role: string;
        };
    }
}

export default new SessionService();