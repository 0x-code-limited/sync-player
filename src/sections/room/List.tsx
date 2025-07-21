"use client";
import React from "react";

// Mock data for public rooms
const mockPublicRooms = [
  {
    id: 1,
    name: "Movie Night with Friends",
    participants: 5,
    isActive: true,
  },
  {
    id: 2,
    name: "Documentary Club",
    participants: 3,
    isActive: true,
  },
  {
    id: 3,
    name: "Anime Watch Party",
    participants: 8,
    isActive: true,
  },
  {
    id: 4,
    name: "Tech Talks",
    participants: 12,
    isActive: true,
  },
];

const List = () => {
  const handleJoinRoom = (roomId: number) => {
    console.log("Joining room:", roomId);
    // Navigate to room or show room interface
  };
  return (
    <>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Public Rooms
      </h3>

      <div className="space-y-4">
        {mockPublicRooms.map((room) => (
          <div
            key={room.id}
            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {room.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {room.participants} participants
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleJoinRoom(room.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Join
              </button>
            </div>
          </div>
        ))}
      </div>

      {mockPublicRooms.length === 0 && (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No public rooms available
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create a room to get started!
          </p>
        </div>
      )}
    </>
  );
};

export default List;
