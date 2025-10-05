import { useEffect, useState } from "react";
import { useJoinRoom, useLeaveRoom } from "./useRoom";

export const useRoomConcierge = (roomId: string) => {
  const { mutate: leaveRoom } = useLeaveRoom();
  const { mutate: joinRoom } = useJoinRoom();

  const [hasJoined, setHasJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // Handle joining room when component mounts
  useEffect(() => {
    if (roomId && !hasJoined && !isJoining) {
      setIsJoining(true);
      try {
        joinRoom(roomId);
        setHasJoined(true);
      } catch (error) {
        console.error("Failed to join room:", error);
      } finally {
        setIsJoining(false);
      }
    }
  }, [roomId, hasJoined, isJoining, joinRoom]);

  // Handle leaving room when component unmounts or page is refreshed/closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable API call when page is closing
      if (roomId && typeof navigator !== "undefined" && navigator.sendBeacon) {
        try {
          // sendBeacon doesn't support custom headers, so we'll rely on session-based auth
          navigator.sendBeacon(`/api/rooms/${roomId}/leave`, "");
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
      if (roomId) {
        leaveRoom(roomId);
      }
    };
  }, [roomId, leaveRoom]);

  return { hasJoined, isJoining };
};
