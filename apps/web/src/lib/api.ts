import { env } from "@team-call-of-code/env/web";

const API_BASE_URL = env.NEXT_PUBLIC_SERVER_URL;

interface LoginCredentials {
    email: string;
    password: string;
    role?: string;
}

interface LoginResponse {
    success: boolean;
    data?: {
        token: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    };
    error?: {
        message: string;
    };
}

export class ApiError extends Error {
    constructor(
        public message: string,
        public status?: number
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export const api = {
    getAuthHeaders() {
        const token = localStorage.getItem("auth_token");
        return {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        };
    },

    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new ApiError(
                    data.error?.message || "Login failed",
                    response.status
                );
            }
            alert("yeee you did it")
            return data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError("Network error. Please check your connection.");
        }
    },

    async getGrievances() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/citizen/grievances`, {
                headers: this.getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to fetch grievances", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while fetching grievances");
        }
    },

    async createGrievance(payload: any) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/citizen/grievances`, {
                method: "POST",
                headers: this.getAuthHeaders(),
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to create grievance", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while creating grievance");
        }
    }
};

