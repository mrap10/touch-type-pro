
import Navbar from "@/components/Navbar";
import TestClientWrapper from "@/components/TestClientWrapper";

export default function Test() {
    return (
        <div className="">
            <Navbar />
            <div className="flex-1 dark:text-gray-300">
                <TestClientWrapper />
            </div>
        </div>
    )
}