import { authAPI, isAuthenticated } from "@/lib/api";
import { useEffect, useState } from "react";

interface User {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    lastLogin: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async () => {
        if (!isAuthenticated()) {
            setLoading(false);
            return;
        }

        try {
            const response = await authAPI.getUserProfile();
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            // Clear invalid token if any
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await authAPI.signIn(email, password);
        localStorage.setItem('token', response.data.token);
        await fetchUserProfile();
        return response;
    };

    const signup = async (username: string, email: string, password: string) => {
        const response = await authAPI.signUp(username, email, password);
        localStorage.setItem('token', response.data.token);
        await fetchUserProfile();
        return response;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    return { 
        user, 
        loading, 
        login, 
        signup, 
        logout,
        isAuthenticated: !!user 
    };
};