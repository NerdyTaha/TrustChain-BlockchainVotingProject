"use client";
import { IconCircleChevronRight } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = axios.get("/api/auth/logout");
      toast.promise(response, {
        loading: "Logging out...",
        success: "Logged out successfully",
        error: "Error logging out",
      });
      router.push("/");
    } catch (error) {
      toast.error("Error logging out:", error);
    }
  };
  return (
    <section className="bg-base-300 h-[calc(100vh-4.8rem)] flex items-center">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-4xl text-base-content font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
            Wait for a while to get approved
          </h1>
          <p className="max-w-2xl mb-6 font-light text-base-content/50 lg:mb-8 md:text-lg lg:text-xl">
            BlockVote ensures fair and tamper-proof elections using blockchain
            technology. Vote securely with Metamask authentication and
            transparent blockchain records.
          </p>
          <button
            className="btn btn-primary text-base font-medium text-center rounded-lg mr-4"
            onClick={handleLogout}
          >
            Logout
            <IconCircleChevronRight />
          </button>
          <a
            href="#"
            className="btn btn-outline text-base font-medium text-center rounded-lg mr-4"
          >
            Learn More
          </a>
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <img src="/bg.png" alt="Blockchain Voting" />
        </div>
      </div>
    </section>
  );
}
