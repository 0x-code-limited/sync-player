"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUser } from "@/hooks/useUser";
import { useCreateRoom } from "@/hooks/useRoom";
import LoadingButton from "@/components/LoadingButton";
import Link from "next/link";

const Form = () => {
  const { data: session } = useSession();
  const { user } = useUser();
  const [roomName, setRoomName] = useState("");
  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { mutate: createRoom } = useCreateRoom();
  useEffect(() => {
    // Check if user.profile.displayName exists, otherwise use session.user.name
    if (user?.profile?.displayName) {
      setName(user.profile.displayName);
    } else if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [user, session]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim() || !name.trim()) {
      return;
    }

    setIsCreating(true);

    console.log("Creating room:", { name: roomName, isPrivate });

    createRoom({
      name: roomName,
      isPublic: !isPrivate,
      settings: {
        allowGuests: true,
        requireApproval: false,
        autoStart: true,
      },
    });

    // Reset form
    setRoomName("");
    setIsPrivate(false);
    setIsCreating(false);
  };

  return (
    <>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Create New Room
      </h3>

      <form onSubmit={handleCreateRoom} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Display Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter display name..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            required
          />
        </div>
        <div>
          <label
            htmlFor="roomName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Room Name *
          </label>
          <input
            type="text"
            id="roomName"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPrivate"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isPrivate"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            Private Room (requires invite code)
          </label>
        </div>

        {!!session ? (
          <button
            type="submit"
            disabled={isCreating || !roomName.trim()}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isCreating ? (
              <LoadingButton text="Creating Room..." />
            ) : (
              "Create Room"
            )}
          </button>
        ) : (
          <Link href="/auth/signin">
            <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
              Sign In to Create Room
            </button>
          </Link>
        )}
      </form>
    </>
  );
};

export default Form;
