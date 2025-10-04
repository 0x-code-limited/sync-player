import React from "react";
import Gear from "@/components/icons/Gear";

type Props = {
  roomName: string;
  onSettingsClick: () => void;
};

const Header = (props: Props) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {props.roomName}
          </h1>
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
  );
};

export default Header;
