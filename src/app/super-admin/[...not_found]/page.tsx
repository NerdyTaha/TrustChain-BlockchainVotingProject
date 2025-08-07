"use client";
import NotFoundImage from "@/Components/404Image";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

const NotFound = () => {
  const { user } = useUser();

  return (
    <div className="flex flex-col items-center justify-center text-base-content bg-base-100 min-h-[calc(100vh-4rem)]">
      <NotFoundImage />
      <h1 className="text-4xl font-bold mt-4">404 - Page Not Found</h1>
      <p className="text-lg text-base-content/60 mt-2">
        {user
          ? "The page you are looking for does not exist."
          : "Please log in to view this page."}
      </p>

      <Link
        href={user ? `/${user.role}/dashboard` : "/"}
        className="btn btn-primary mt-6"
      >
        {user ? "Go to Dashboard" : "Go to Home"}
      </Link>
    </div>
  );
};

export default NotFound;
