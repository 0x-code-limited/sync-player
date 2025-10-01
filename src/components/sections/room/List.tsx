"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRooms, useUserRooms, useDeleteRoom } from "@/hooks/useRoom";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const List = () => {
  const { user } = useAuth();
  const { data: rooms } = useRooms({ isPublic: true });
  const { data: userRooms } = useUserRooms(user?.id || "");
  const deleteRoomMutation = useDeleteRoom();
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);

  const router = useRouter();

  const handleJoinRoom = (roomId: string) => {
    console.log("Joining room:", roomId);
    router.push(`/room/${roomId}`);
    // Navigate to room or show room interface
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this room? This action cannot be undone."
      )
    ) {
      setDeletingRoomId(roomId);
      try {
        await deleteRoomMutation.mutateAsync(roomId);
      } catch (error) {
        console.error("Failed to delete room:", error);
      } finally {
        setDeletingRoomId(null);
      }
    }
  };
  return (
    <div className="space-y-8">
      {/* User's Owned Rooms */}
      {user && userRooms && userRooms.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            My Rooms
          </h3>
          <div className="space-y-4">
            {userRooms.map((room) => (
              <div
                key={room._id.toString()}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {room.name} -{" "}
                  </h4>

                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {room.isPublic ? "Public" : "Private"} -{" "}
                    {room.currentParticipants} participants
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleJoinRoom(room._id.toString())}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Join
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room._id.toString())}
                    disabled={deletingRoomId === room._id.toString()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingRoomId === room._id.toString()
                      ? "Deleting..."
                      : "Remove"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Public Rooms */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Public Rooms
        </h3>

        <div className="space-y-4">
          {rooms?.rooms
            .filter((room) => room.ownerId !== user?.id)
            .map((room) => (
              <div
                key={room._id.toString()}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {room.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {room.currentParticipants} participants
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleJoinRoom(room._id.toString())}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Join
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default List;
