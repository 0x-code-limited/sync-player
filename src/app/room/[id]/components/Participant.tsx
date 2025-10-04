import Image from "next/image";
import React from "react";

type Props = {
  name: string;
  image?: string;
};

const Participant = (props: Props) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
      <div className="flex flex-row items-center gap-3">
        <Image
          src={props.image || "/participants-placeholder-image.png"}
          alt={props.name}
          width={32}
          height={32}
          className="rounded-full"
        />
        <h3 className="font-medium text-gray-900 dark:text-white">
          {props.name}
        </h3>
      </div>
    </div>
  );
};

export default Participant;
