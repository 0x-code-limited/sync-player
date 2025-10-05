"use client";
import { useLeaveRoom, useJoinRoom, useRoom } from "@/hooks/useRoom";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import RightSection from "./components/RightSection";
import LeftSection from "./components/LeftSection";
import { RoomSkeleton } from "@/components/LoadingSkeleton";

const RoomPage = () => {
  const { id } = useParams();
  const [hasJoined, setHasJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const { mutate: leaveRoom } = useLeaveRoom();
  const { mutate: joinRoom } = useJoinRoom();
  const { isLoading: isRoomLoading } = useRoom(id as string);
  // Handle joining room when component mounts
  useEffect(() => {
    if (id && !hasJoined && !isJoining) {
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
