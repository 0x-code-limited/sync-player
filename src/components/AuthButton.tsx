"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg">
        Loading...
      </div>
    );
  }

  if (session) {
    return (
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
          <Link href="/profile">
            <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:inline">
              {session.user?.name}
            </span>
          </Link>
        </div>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
        >
          Sign Out
        </button>
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
