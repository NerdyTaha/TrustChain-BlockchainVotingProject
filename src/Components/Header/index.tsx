"use client";
import Link from "next/link";
import { IconChevronDown, IconPasswordUser } from "@tabler/icons-react";
import ThemeToggler from "./ThemeToggler";

const Header = () => {
  return (
    <>
      <div className="navbar px-10 py-2 bg-base-300">
        <div className="navbar-start">
          <Link href="/" className="space-x-3 flex items-center">
            <IconPasswordUser size={50} className="text-primary" />
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-[2px]">
                <span className="text-primary font-extrabold text-xl">
                  Trust
                </span>
                <span className="text-accent font-semibold text-xl">Chain</span>
              </div>
              <hr className="w-full border border-base-content" />
              <span className="text-sm text-base-content/70 italic">
                Blockchain based voting system
              </span>
            </div>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-base text-base-content">
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/features">Features</Link>
            </li>
            <li>
              <Link href="/results">Results</Link>
            </li>
            <li>
              <Link href="/voters">Check Your Name</Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end space-x-3">
          <Link href="/login" className="btn btn-accent">
            Login
          </Link>
          <div className="dropdown dropdown-end">
            <span
              tabIndex={0}
              className="flex items-center justify-center gap-3 h-full w-full btn btn-primary"
            >
              Sign Up <IconChevronDown />
            </span>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow text-base-content"
            >
              <li>
                <Link href="/signup" className="btn btn-ghost">
                  Admin
                </Link>
              </li>
              <li>
                <Link href="/signup/candidate-signup" className="btn btn-ghost">
                  Candidate
                </Link>
              </li>
            </ul>
          </div>
          <ThemeToggler />
        </div>
      </div>
    </>
  );
};

export default Header;
