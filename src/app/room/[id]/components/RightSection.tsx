import React, { useState } from "react";
import RoomHeader from "./RoomHeader";
import Details from "./Details";
import SettingModal from "./SettingModal";
import { useRouter } from "next/navigation";
import { useLeaveRoom, useRoom, useUpdateRoom } from "@/hooks/useRoom";
import { RoomDetailsSkeleton } from "@/components/LoadingSkeleton";

interface Props {
  roomId: string;
}
const RightSection = (props: Props) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { data: room, isLoading } = useRoom(props.roomId);
  const { mutate: updateRoom } = useUpdateRoom();
  const { mutate: leaveRoom } = useLeaveRoom();

  const router = useRouter();

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
    // This would typically make an API call to update the room
    await updateRoom({ id: props.roomId, data });
  };

  const handleLeaveRoom = () => {
    leaveRoom(props.roomId);
    router.push("/");
  };
  if (isLoading) {
    return (
      <section className="w-full lg:w-[30%] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-6 w-48"></div>
            <div className="flex space-x-2">
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-8 w-8"></div>
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-8 w-20"></div>
            </div>
          </div>
        </div>
        <RoomDetailsSkeleton />
      </section>
    );
  }

  return (
    <>
      <section className="w-full lg:w-[30%] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
        <RoomHeader
          roomName={room?.name || ""}
          onSettingsClick={handleSettingsClick}
          onLeaveClick={handleLeaveRoom}
        />
        <Details roomId={props.roomId} />
      </section>
      <SettingModal
        isOpen={isSettingsModalOpen}
        onClose={handleCloseModal}
        room={room || null}
        onSave={handleSaveSettings}
      />
    </>
  );
};

export default RightSection;
