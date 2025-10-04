"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    signOut();
    setIsDropdownOpen(false);
  };

  if (status === "loading") {
    return (
      <div className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg">
        Loading...
      </div>
    );
  }

  if (session) {
    return (
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-8 h-8 rounded-full"
                width={32}
                height={32}
              />
            )}
            <button
              onClick={toggleDropdown}
              className="text-sm text-gray-700 dark:text-gray-300 hidden sm:inline hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
            >
              {session.user?.name}
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href="/auth/signin">
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
        Sign In
      </button>
    </Link>
  );
}
