"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [darkMode, setDarkMode] = useState(false);

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
            <h1 className="text-lg font-bold">TouchType</h1>
            <div>
                <Link href={"/"} className="mr-4 hover:underline">
                    Home
                </Link>
                <Link href={"/test"} className="mr-4 hover:underline">
                    Test
                </Link>
                <Link href={"/race"} className="hover:underline">
                    Race
                </Link>
            </div>

            <div className="flex items-center space-x-10">
                <div onClick={toggleTheme} className="cursor-pointer">
                    {darkMode
                        ? <Moon className="text-blue-400 fill-blue-400" />
                        : <Sun className="text-yellow-500 fill-yellow-500" />
                    }
                </div>
                <div className="rounded-full w-8 h-8 flex items-center justify-center bg-emerald-500 text-white">
                    <h1 className="font-bold">A</h1>
                </div>
            </div>
        </nav>
    );
}
