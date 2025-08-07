"use client";
import ThemeToggler from "@/Components/Header/ThemeToggler";
import { SideNavItem } from "@/types/types";
import { SIDENAV_ITEMS } from "./constant";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import {
  IconChevronDown,
  IconChevronRight,
  IconMenu,
  IconPasswordUser,
} from "@tabler/icons-react";
import { useUser } from "@/context/UserContext";
import toast from "react-hot-toast";

const SideNav = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user } = useUser();
  const handleLogout = async () => {
    const res = axios.get("/api/auth/logout");
    toast.promise(res, {
      loading: "Logging out...",
      success: () => {
        router.push("/");
        return "Logged out successfully";
      },
      error: "An error occurred while logging out",
    });
  };
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  if (!user) return null;
  return (
    <>
      <div className="drawer lg:drawer-open max-h-screen">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="navbar justify-between bg-base-300 w-full pl-10">
            <div className="lg:flex items-center justify-end space-x-2 hidden text-base-content">
              <span className="text-base font-semibold">Home</span>
              {pathSegments.map((segment, index) => (
                <React.Fragment key={index}>
                  <span className="text-sm">
                    <IconChevronRight />
                  </span>
                  <Link href={`/${pathSegments.slice(0, index + 1).join("/")}`}>
                    <span className="text-base capitalize hover:text-primary transition">
                      {segment.replace(/-/g, " ")}
                    </span>
                  </Link>
                </React.Fragment>
              ))}
            </div>
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <IconMenu className="h-6 w-6 text-base-content" />
              </label>
            </div>

            <div className="flex-1 justify-between lg:hidden px-2">
              <h1 className="text-xl font-bold flex items-center">
                <span className="h-7 w-7 ">
                  <IconPasswordUser size={28} className="text-base-content" />
                </span>
                <span className="text-primary">Trust</span>
                <span className="text-secondary">Chain</span>
              </h1>
              <ThemeToggler />
            </div>

            <div className="hidden lg:block">
              <ul className="menu menu-horizontal flex items-center space-x-4">
                <ThemeToggler />
                <div className="dropdown dropdown-left cursor-pointer bg-transparent">
                  <Image
                    src={user.profileImage!}
                    alt="Avatar"
                    className="rounded-full"
                    width={40}
                    height={40}
                    tabIndex={0}
                    role="button"
                  />
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-72 p-2 shadow"
                  >
                    {/* User Initial */}
                    <div className="flex items-center justify-center mb-2">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary text-base-conten rounded-full text-xl font-bold">
                        {user.name[0].toUpperCase()}
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <span className="text-lg font-semibold text-base-content">
                        {user.name}
                      </span>
                    </div>
                    <hr className="my-2 border-base-content" />
                    <div className="flex flex-col">
                      <Link
                        className="text-left px-4 py-2 text-base-content hover:bg-base-200 transition duration-200"
                        href={`/user/my-account`}
                      >
                        My Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-left px-4 py-2 text-base-content text-dark hover:bg-base-200 transition duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </ul>
                </div>
              </ul>
            </div>
          </div>
          <div>
            {" "}
            <main className="overflow-y-auto h-[calc(100vh-5rem)] bg-base-100 p-10 text-base-content">
              {children}
            </main>
          </div>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            className="drawer-overlay"
            aria-label="close sidebar"
          ></label>
          <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <Link
              href={`/${user.userType}/dashboard`}
              className="flex h-16 w-full flex-row items-center justify-center space-x-3 border-b border-base-content md:justify-start md:px-6"
            >
              <span className="h-7 w-7 rounded-lg bg-base-200">
                <IconPasswordUser size={28} className="text-base-content" />
              </span>
              <span className="text-xl font-bold text-base-content">
                <h1 className="text-xl font-bold">
                  <span className="text-primary">Trust</span>
                  <span className="text-secondary">Chain</span>
                </h1>
              </span>
            </Link>
            <div className="flex flex-col space-y-2 mt-10 md:px-6">
              {SIDENAV_ITEMS.map((item, idx) => (
                <MenuItem key={idx} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  const baseClasses =
    "flex w-full flex-row items-center justify-between rounded-lg p-2 hover:bg-accent";
  const activeClasses = "bg-base-300 text-base-content";
  const inactiveClasses =
    "text-base-content hover:text-base-content hover:bg-base-100";

  return (
    <div>
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`${baseClasses} ${
              pathname.includes(item.path) ? activeClasses : inactiveClasses
            }`}
          >
            <div className="flex flex-row items-center space-x-4 text-base-content">
              {item.icon}
              <span className="text-lg font-medium">{item.title}</span>
            </div>

            <div
              className={`transition-transform ${
                subMenuOpen ? "rotate-180" : ""
              } flex`}
            >
              <IconChevronDown width="24" height="24" />
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-4 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => (
                <Link
                  key={idx}
                  href={subItem.path}
                  className={`block rounded-lg p-2 text-base ${
                    subItem.path === pathname
                      ? "font-semibold text-base-content"
                      : "text-base-content/2"
                  } hover:bg-accent`}
                >
                  <span>{subItem.title}</span>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row items-center space-x-4 rounded-lg p-2 ${
            item.path === pathname ? activeClasses : inactiveClasses
          }`}
        >
          {item.icon}
          <span className="text-lg font-medium">{item.title}</span>
        </Link>
      )}
    </div>
  );
};
