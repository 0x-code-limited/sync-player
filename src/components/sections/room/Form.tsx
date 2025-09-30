"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCreateRoom } from "@/hooks/useRoom";

const Form = () => {
  const { data: session } = useSession();
  const [roomName, setRoomName] = useState("");
  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { mutate: createRoom } = useCreateRoom();
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

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

        <button
          type="submit"
          disabled={isCreating || !roomName.trim()}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isCreating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating Room...
            </>
          ) : (
            "Create Room"
          )}
        </button>
      </form>
    </>
  );
};

export default Form;
