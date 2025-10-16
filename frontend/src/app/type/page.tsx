
import Navbar from "@/components/Navbar";
import TestClientWrapper from "@/components/TestClientWrapper";

export default function Type() {
    return (
        <div className="flex flex-col justify-between min-h-screen bg-gray-200 dark:bg-gray-900">
            <Navbar />
            <div className="flex-1 dark:text-gray-300">
                <TestClientWrapper />
            </div>
        </div>
    )
}