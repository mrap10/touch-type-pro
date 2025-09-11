import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <h1 className="text-lg font-bold">Touch Type</h1>
            <div>
                <Link href={"/"} className="mr-4 hover:underline">
                    Home
                </Link>
                <Link href={"/test"} className="hover:underline">
                    Test
                </Link>
            </div>

            <div className="rounded-full w-8 h-8 flex items-center justify-center bg-emerald-500">
                <h1 className="font-bold">A</h1>
            </div>
        </nav>
    );
}
