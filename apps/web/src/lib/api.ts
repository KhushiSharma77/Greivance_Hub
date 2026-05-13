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
    getAuthHeaders(isFormData = false) {
        const token = localStorage.getItem("auth_token");
        return {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
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

    async createGrievance(payload: FormData | any) {
        try {
            const isFormData = payload instanceof FormData;
            const response = await fetch(`${API_BASE_URL}/api/v1/citizen/grievances`, {
                method: "POST",
                headers: this.getAuthHeaders(isFormData),
                body: isFormData ? payload : JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to create grievance", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while creating grievance");
        }
    },

    async getGrievanceById(id: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/citizen/grievances/${id}`, {
                headers: this.getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to fetch grievance", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while fetching grievance");
        }
    },

    async updateGrievance(id: string, payload: FormData | any) {
        try {
            const isFormData = payload instanceof FormData;
            const response = await fetch(`${API_BASE_URL}/api/v1/citizen/grievances/${id}`, {
                method: "PATCH",
                headers: this.getAuthHeaders(isFormData),
                body: isFormData ? payload : JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to update grievance", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while updating grievance");
        }
    },

    async deleteGrievance(id: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/citizen/grievances/${id}`, {
                method: "DELETE",
                headers: this.getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to delete grievance", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while deleting grievance");
        }
    },

    // Officer API methods
    async getOfficerGrievances() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/officer/grievances`, {
                headers: this.getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to fetch officer grievances", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while fetching officer grievances");
        }
    },

    async getOfficerGrievanceById(id: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/officer/grievances/${id}`, {
                headers: this.getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to fetch grievance", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while fetching grievance");
        }
    },

    async updateGrievanceStatus(id: string, status: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/officer/grievances/${id}/status`, {
                method: "PATCH",
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ status }),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to update grievance status", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while updating grievance status");
        }
    },

    // Admin API methods
    async createDepartment(payload: { name: string; code: string; city: string }) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/admin/departments`, {
                method: "POST",
                headers: this.getAuthHeaders(),
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to create department", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while creating department");
        }
    },

    async assignOfficerToDepartment(departmentId: string, officerId: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/admin/departments/${departmentId}/assign-officer`, {
                method: "POST",
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ officerId }),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to assign officer", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while assigning officer");
        }
    },

    async getDepartmentOfficers(departmentId: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/admin/departments/${departmentId}/officers`, {
                method: "GET",
                headers: this.getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to fetch department officers", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while fetching department officers");
        }
    },

    async removeOfficerFromDepartment(departmentId: string, officerId: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/admin/departments/${departmentId}/officers/${officerId}`, {
                method: "DELETE",
                headers: this.getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to remove officer", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while removing officer");
        }
    },

    async getAllDepartments() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/admin/departments`, {
                headers: this.getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to fetch departments", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while fetching departments");
        }
    },

    async createUser(payload: { email: string; password: string; role: 'officer' | 'admin'; name: string }) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/admin/users`, {
                method: "POST",
                headers: this.getAuthHeaders(),
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to create user", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while creating user");
        }
    },

    async getAllUsers() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/admin/users`, {
                headers: this.getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to fetch users", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while fetching users");
        }
    },

    async assignDepartmentToUser(userId: string, departmentId: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/admin/users/${userId}/department`, {
                method: "PATCH",
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ departmentId }),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to assign department", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while assigning department");
        }
    },

    // Profile API methods
    async getProfile() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/citizen/profile`, {
                headers: this.getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to fetch profile", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while fetching profile");
        }
    },

    async updateProfile(payload: { name?: string; phone?: string; address?: string; aadhaarNumber?: string }) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/citizen/profile`, {
                method: "PATCH",
                headers: this.getAuthHeaders(),
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to update profile", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while updating profile");
        }
    },

    async uploadProfilePicture(file: File) {
        try {
            const formData = new FormData();
            formData.append("photo", file);
            const response = await fetch(`${API_BASE_URL}/api/v1/citizen/profile/picture`, {
                method: "POST",
                headers: this.getAuthHeaders(true),
                body: formData,
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to upload picture", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while uploading picture");
        }
    },

    // Social Feed API methods
    async getFeed() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/feed`, {
                headers: this.getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to fetch feed", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while fetching feed");
        }
    },

    async toggleUpvote(id: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/feed/${id}/upvote`, {
                method: "POST",
                headers: this.getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new ApiError(data.error?.message || "Failed to toggle upvote", response.status);
            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError("Network error while toggling upvote");
        }
    },
};

