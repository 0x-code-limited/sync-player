import React from "react";

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton = ({ className = "", children }: SkeletonProps) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    >
      {children}
    </div>
  );
};

export const RoomSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        {/* Left Section Skeleton - Video Player */}
        <section className="w-full lg:w-[70%] bg-black flex items-center justify-center">
          <div className="w-full h-full max-h-[60vh] lg:max-h-full flex items-center justify-center">
            <Skeleton className="w-full h-full max-w-4xl max-h-96">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-lg mb-2">Loading room...</p>
                  <p className="text-sm text-gray-400">Please wait</p>
                </div>
              </div>
            </Skeleton>
          </div>
        </section>

        {/* Right Section Skeleton */}
        <section className="w-full lg:w-[30%] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          {/* Room Header Skeleton */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-20 rounded" />
              </div>
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="p-4 space-y-4">
            {/* Room Info */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Participants Section */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>

            {/* Video URL Section */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export const VideoPlayerSkeleton = () => {
  return (
    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg mb-2">Loading video...</p>
        <p className="text-sm text-gray-400">Please wait</p>
      </div>
    </div>
  );
};

export const RoomDetailsSkeleton = () => {
  return (
    <div className="p-4 space-y-4">
      {/* Room Info */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Participants Section */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Video URL Section */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
};
