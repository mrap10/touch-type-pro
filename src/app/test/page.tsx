
import Navbar from "@/components/Navbar";
import TestClientWrapper from "@/components/TestClientWrapper";
import Link from "next/link";

export default function Test() {
    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <h1>
                    this is a test page
                </h1>
                <Link href={"/"} className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 cursor-pointer text-white rounded">
                    Go to Home
                </Link>
                <TestClientWrapper />
            </div>
        </div>
    )
}