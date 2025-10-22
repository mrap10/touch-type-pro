import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function NotFound() {
    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center h-[calc(100vh-64px)] px-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        The lesson you&lsquo;re looking for doesn&lsquo;t exist.
                    </p>
                    <Link
                        href="/learn"
                        className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Back to Lessons
                    </Link>
                </div>
            </div>
        </div>
    );
}