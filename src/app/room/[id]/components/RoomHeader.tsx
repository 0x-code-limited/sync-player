import React from "react";
import Gear from "@/components/icons/Gear";

type Props = {
  roomName: string;
  onSettingsClick: () => void;
  onLeaveClick: () => void;
};

const RoomHeader = (props: Props) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {props.roomName}
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={props.onLeaveClick}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Leave Room
            </button>
            <button
              onClick={props.onSettingsClick}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Room settings"
            >
              <Gear />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomHeader;
