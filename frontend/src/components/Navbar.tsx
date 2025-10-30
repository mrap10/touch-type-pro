"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

export default function Navbar() {
    const [darkMode, setDarkMode] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, logout } = useAuthContext();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/type", label: "Type" },
        { href: "/race", label: "Race" },
        { href: "/learn", label: "Learn" },
    ];

    const getNavLinkClassName = (href: string) => {
        const isActive = href === "/learn" 
            ? pathname.startsWith("/learn")
            : pathname === href;
        const baseClasses = "sm:mr-2 px-2 py-1 hover:text-emerald-500 focus:outline-none rounded-lg transition-colors";
        
        if (isActive) {
            return `${baseClasses} text-emerald-500 font-bold`;
        }
        
        return `${baseClasses} focus:text-emerald-800 dark:focus:text-emerald-500`;
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            document.documentElement.classList.add("dark");
            setDarkMode(true);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    const toggleTheme = () => {
        const newTheme = !darkMode;
        setDarkMode(newTheme);
        if (newTheme) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        router.push('/');
    };

    return (
        <nav className="p-4 flex justify-between items-center shadow dark:shadow-gray-800">
            <h1 className="sm:text-lg font-bold">TouchType<span className="text-emerald-500">Pro</span></h1>
            <div className="text-gray-600 font-semibold dark:text-gray-400 flex items-center">
                {navLinks.map((link) => (
                    <Link 
                        key={link.href} 
                        href={link.href} 
                        className={getNavLinkClassName(link.href)}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            <div className="flex items-center space-x-10">
                {!loading && (
                    <>
                        {!user ? (
                            <Link
                                href="/signin"
                                className="text-emerald-600 hover:underline cursor-pointer dark:text-emerald-400"
                            >
                                Login
                            </Link>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <div 
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="rounded-full w-8 h-8 flex items-center justify-center bg-emerald-500 text-white cursor-pointer hover:bg-emerald-600 transition-colors"
                                >
                                    <h1 className="font-bold">{user.username.charAt(0).toUpperCase()}</h1>
                                </div>
                                
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-semibold">{user.username}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm cursor-pointer text-red-600 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
                <div onClick={toggleTheme} className="cursor-pointer">
                    {darkMode
                        ? <Moon className="text-blue-400 fill-blue-400" />
                        : <Sun className="text-yellow-500 fill-yellow-500" />
                    }
                </div>
            </div>
        </nav>
    );
}
