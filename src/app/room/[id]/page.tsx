"use client";
import { useRoom } from "@/hooks/useRoom";
import { useParams } from "next/navigation";
import React from "react";
import RightSection from "./components/RightSection";
import LeftSection from "./components/LeftSection";
import { RoomSkeleton } from "@/components/LoadingSkeleton";
import { useRoomConcierge } from "@/hooks/useRoomConcierge";

const RoomPage = () => {
  const { id } = useParams();
  const { isJoining } = useRoomConcierge(id as string);

  const { isLoading: isRoomLoading } = useRoom(id as string);

  // Show full page skeleton while room data is loading
  if (isRoomLoading) {
    return <RoomSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content - Responsive Layout */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        {/* Video Player Section - 70% width on desktop, full width on mobile */}
        <LeftSection roomId={id as string} isJoining={isJoining} />

        {/* Right Section - 30% width on desktop, full width on mobile */}
        <RightSection roomId={id as string} />
      </div>

      {/* Settings Modal */}
    </div>
  );
};

export default RoomPage;
