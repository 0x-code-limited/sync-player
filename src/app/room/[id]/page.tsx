"use client";
import {
  useRoom,
  useUpdateRoom,
  useLeaveRoom,
  useJoinRoom,
} from "@/hooks/useRoom";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import SettingModal from "./components/SettingModal";
import Details from "./components/Details";

const RoomPage = () => {
  const { id } = useParams();
  const { data: room } = useRoom(id as string);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const { mutate: updateRoom } = useUpdateRoom();
  const { mutate: leaveRoom } = useLeaveRoom();
  const { mutate: joinRoom } = useJoinRoom();
  const router = useRouter();
  // Handle joining room when component mounts
  useEffect(() => {
    if (id && !hasJoined && !isJoining) {
      console.log("Joining room:", id);
      setIsJoining(true);
      try {
        joinRoom(id as string);
        setHasJoined(true);
      } catch (error) {
        console.error("Failed to join room:", error);
      } finally {
        setIsJoining(false);
      }
    }
  }, [id, hasJoined, isJoining, joinRoom]);

  // Handle leaving room when component unmounts or page is refreshed/closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable API call when page is closing
      if (id && typeof navigator !== "undefined" && navigator.sendBeacon) {
        try {
          // sendBeacon doesn't support custom headers, so we'll rely on session-based auth
          navigator.sendBeacon(`/api/rooms/${id}/leave`, "");
        } catch (error) {
          console.error("Failed to leave room on page unload:", error);
        }
      }
    };

    // Add beforeunload listener for page refresh/close
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Remove the event listener
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // Call leave room API when component unmounts (navigation)
      if (id) {
        leaveRoom(id as string);
      }
    };
  }, [id, leaveRoom]);

  const handleSettingsClick = () => {
    setIsSettingsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSettingsModalOpen(false);
  };

  const handleSaveSettings = async (data: {
    name: string;
    description: string;
    isPublic: boolean;
    videoUrl: string;
  }) => {
    // TODO: Implement API call to update room settings
    console.log("Saving room settings:", data);
    // This would typically make an API call to update the room
    await updateRoom({ id: id as string, data });
  };

  const handleLeaveRoom = () => {
    if (id) {
      leaveRoom(id as string);
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content - Responsive Layout */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        {/* Video Player Section - 70% width on desktop, full width on mobile */}
        <div className="w-full lg:w-[70%] bg-black flex items-center justify-center">
          <div className="w-full h-full max-h-[60vh] lg:max-h-full flex items-center justify-center">
            {/* Video Player */}
            <div className="w-full h-full flex items-center justify-center">
              {room?.videoUrl ? (
                <video
                  src={room.videoUrl}
                  controls
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.error("Video failed to load:", e);
                  }}
                  onLoadStart={() => {
                    console.log("Video started loading");
                  }}
                  onCanPlay={() => {
                    console.log("Video can start playing");
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                  <div className="text-center">
                    {isJoining ? (
                      <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-lg mb-2">Joining room...</p>
                        <p className="text-sm text-gray-400">
                          Please wait while we connect you
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg mb-2">No video URL provided</p>
                        <p className="text-sm text-gray-400">
                          Add a video URL in room settings
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - 30% width on desktop, full width on mobile */}
        <div className="w-full lg:w-[30%] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          <Header
            roomName={room?.name || ""}
            onSettingsClick={handleSettingsClick}
            onLeaveClick={handleLeaveRoom}
          />
          <Details roomId={id as string} />
        </div>
      </div>

      {/* Settings Modal */}
      <SettingModal
        isOpen={isSettingsModalOpen}
        onClose={handleCloseModal}
        room={room || null}
        onSave={handleSaveSettings}
      />
    </div>
  );
};

export default RoomPage;
