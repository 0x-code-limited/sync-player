"use client";

import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

export function UserProfile() {
  const { user, isLoading, updateProfile, isUpdatingProfile } = useUser();
  const { setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    displayName: user?.profile?.displayName || "",
    bio: user?.profile?.bio || "",
    preferences: {
      theme: user?.profile?.preferences?.theme || "system",
      notifications: user?.profile?.preferences?.notifications ?? true,
    },
  });

  useEffect(() => {
    setProfile({
      displayName: user?.profile?.displayName || "",
      bio: user?.profile?.bio || "",
      preferences: {
        theme: user?.profile?.preferences?.theme || "system",
        notifications: user?.profile?.preferences?.notifications ?? true,
      },
    });
  }, [user]);

  const handleSave = () => {
    updateProfile(profile, {
      onSuccess: () => {
        setIsEditing(false);
        // set theme to the profile.preferences.theme
        setTheme(profile.preferences.theme);
      },
      onError: (error) => {
        console.error("Error updating profile:", error);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 text-gray-900 dark:text-gray-100">
        Loading user profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 text-gray-900 dark:text-gray-100">
        No user data available
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex items-center space-x-4 mb-4">
        {user.image && (
          <Image
            src={user.image}
            alt={user.name}
            className="w-16 h-16 rounded-full"
            width={64}
            height={64}
          />
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {user.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Display Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) =>
                setProfile({ ...profile, displayName: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
              {profile.displayName || "Not set"}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bio
          </label>
          {isEditing ? (
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
              {profile.bio || "No bio provided"}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Theme Preference
          </label>
          {isEditing ? (
            <select
              value={profile.preferences.theme}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  preferences: {
                    ...profile.preferences,
                    theme: e.target.value as "light" | "dark" | "system",
                  },
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          ) : (
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 capitalize">
              {profile.preferences.theme}
            </p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="notifications"
            checked={profile.preferences.notifications}
            onChange={(e) =>
              setProfile({
                ...profile,
                preferences: {
                  ...profile.preferences,
                  notifications: e.target.checked,
                },
              })
            }
            disabled={!isEditing}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
          />
          <label
            htmlFor="notifications"
            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
          >
            Enable notifications
          </label>
        </div>

        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isUpdatingProfile}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isUpdatingProfile ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setProfile({
                    displayName: user.profile?.displayName || "",
                    bio: user.profile?.bio || "",
                    preferences: {
                      theme: user.profile?.preferences?.theme || "system",
                      notifications:
                        user.profile?.preferences?.notifications ?? true,
                    },
                  });
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
