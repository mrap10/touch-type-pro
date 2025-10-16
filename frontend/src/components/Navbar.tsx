"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [darkMode, setDarkMode] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/type", label: "Type" },
        { href: "/race", label: "Race" },
        { href: "/learn", label: "Learn" },
    ];

    const getNavLinkClassName = (href: string) => {
        const isActive = pathname === href;
        const baseClasses = "sm:mr-2 px-2 py-1 hover:text-emerald-500 focus:outline-none rounded-lg transition-colors";
        
        if (isActive) {
            return `${baseClasses} text-emerald-600 font-bold`;
        }
        
        return `${baseClasses} focus:text-emerald-800 dark:focus:text-emerald-400`;
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            document.documentElement.classList.add("dark");
            setDarkMode(true);
        }
    }, []);

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
                <div onClick={toggleTheme} className="cursor-pointer">
                    {darkMode
                        ? <Moon className="text-blue-400 fill-blue-400" />
                        : <Sun className="text-yellow-500 fill-yellow-500" />
                    }
                </div>
                {/* <div className="rounded-full w-8 h-8 flex items-center justify-center bg-emerald-500 text-white">
                    <h1 className="font-bold">A</h1>
                </div> */}
            </div>
        </nav>
    );
}
