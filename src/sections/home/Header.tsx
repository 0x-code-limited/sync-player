import React from "react";
import ThemeToggle from "@/components/ThemeToggle";
import AuthButton from "@/components/AuthButton";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sync Player
            </h1>
          </div>
        </Link>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-4">
          <Link
            href="/room"
            className="hidden md:inline px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
          >
            Go to Room
          </Link>
          <AuthButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
