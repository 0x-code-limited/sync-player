import React from "react";
import { useRoom } from "@/hooks/useRoom";
import { VideoPlayerSkeleton } from "@/components/LoadingSkeleton";

type Props = {
  roomId: string;
  isJoining: boolean;
};

const LeftSection = (props: Props) => {
  const { data: room, isLoading } = useRoom(props.roomId);

  // Show loading skeleton while room data is loading
  if (isLoading) {
    return (
      <section className="w-full lg:w-[80%] bg-black flex items-center justify-center">
        <div className="w-full h-full max-h-[60vh] lg:max-h-full flex items-center justify-center">
          <VideoPlayerSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full lg:w-[80%] bg-black flex items-center justify-center">
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
                {props.isJoining ? (
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
    </section>
  );
};

export default LeftSection;
