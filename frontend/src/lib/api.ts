const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    stats?: UserStats;
}

interface LessonProgress {
    id: string;
    lessonId: string;
    mode: 'NORMAL' | 'DEV';
    star: number;
    accuracy: number | null;
    wpm: number | null;
    focusKeys: string[];
    updatedAt: string;
}

interface UserStats {
    totalLessons: number;
    averageAccuracy: number;
    averageWpm: number;
    totalStars: number;
    completedLessons: number;
}

interface UserProfile {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    lastLogin: string;
    progress: LessonProgress[];
}

const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
};

async function apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = getAuthToken();
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...headers,
            ...(options.headers as Record<string, string>),
        },
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMessage = data.error || data.message || 'API call failed';
        
        if (data.details && Array.isArray(data.details) && data.details.length > 0) {
            const detailMessages = data.details.map((d: { message: string }) => d.message).join(', ');
            throw new Error(detailMessages || errorMessage);
        }
        
        throw new Error(errorMessage);
    }

    return data;
}

export const authAPI = {
    signUp: async (username: string, email: string, password: string) => {
        return apiCall<{ token: string }>('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
        });
    },

    signIn: async (email: string, password: string) => {
        return apiCall<{ token: string }>('/auth/signin', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    getUserProfile: async () => {
        return apiCall<UserProfile>('/auth/profile');
    }
}

export const learnAPI = {
    // all lessons
    getUserProgress: async (mode?: 'NORMAL' | 'DEV', minStars?: number) => {
        const params = new URLSearchParams();
        if (mode) params.append('mode', mode);
        if (minStars !== undefined) params.append('minStars', minStars.toString());
        
        const query = params.toString() ? `?${params.toString()}` : '';
        return apiCall<LessonProgress[]>(`/learn/progress${query}`);
    },

    // specific lesson
    getLessonProgress: async (lessonId: string) => {
        return apiCall<LessonProgress | null>(`/learn/progress/${lessonId}`);
    },

    saveLessonProgress: async (progressData: {
        lessonId: string;
        accuracy: number;
        wpm: number;
        focusKeys?: string[];
        star: number;
        mode: 'NORMAL' | 'DEV';
        errorPatterns?: string[];
    }) => {
        return apiCall<LessonProgress>('/learn/progress', {
            method: 'POST',
            body: JSON.stringify(progressData),
        });
    },

    deleteLessonProgress: async (lessonId: string) => {
        return apiCall<{ message: string }>(`/learn/progress/${lessonId}`, {
            method: 'DELETE',
        });
    },
};

export const isAuthenticated = (): boolean => {
    return getAuthToken() !== null;
};

export type { LessonProgress, UserStats, ApiResponse };