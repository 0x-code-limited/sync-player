"use client";
import { useRoom, useUpdateRoom } from "@/hooks/useRoom";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import Header from "./components/Header";
import SettingModal from "./components/SettingModal";
import Details from "./components/Details";

const RoomPage = () => {
  const { id } = useParams();
  const { data: room } = useRoom(id as string);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { mutate: updateRoom } = useUpdateRoom();

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
                    <p className="text-lg mb-2">No video URL provided</p>
                    <p className="text-sm text-gray-400">
                      Add a video URL in room settings
                    </p>
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
