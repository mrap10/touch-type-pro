import Navbar from "@/components/Navbar";
import { Construction } from "lucide-react";

export default function Learn() {
    return (
        <div>
            <Navbar />
            <div className="flex flex-col justify-center items-center gap-3 min-h-[calc(100vh-4rem)]">
                <Construction className="animate-pulse w-40 h-40" />
                <h1 className="text-2xl font-bold text-center">
                    Here you can learn and improve your typing speed with personalized AI curated lessons.
                </h1>
                <p className="text-gray-500 text-center">This feature is under development</p>
            </div>
        </div>
    )
}