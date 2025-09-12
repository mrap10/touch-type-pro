import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen py-2 text-black">
        <h1 className="text-4xl font-bold">Welcome to Touch Type</h1>
        <p className="text-lg">Your playground to improve your typing skills</p>
        <Link href={"/test"} className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 cursor-pointer text-white rounded">
          Start Typing Test
        </Link>
      </div>
    </div>
  );
}
