const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    stats?: any;
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
        throw new Error(data.message || 'API call failed');
    }

    return data;
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
        errorPatterns?: any;
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