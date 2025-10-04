import React from "react";
import Participant from "./Participant";

interface Props {
  roomId: string;
}
const Details = (props: Props) => {
  console.log("🚀 ~ Details ~ props:", props);
  const mockParticipants = [
    {
      name: "John Doe",
      image: "/participants-placeholder-image.png",
    },
  ];
  return (
    <div className="h-full flex flex-col">
      {/* Right section content */}
      <div className="flex-1 p-4">
        {/* Placeholder content for right section */}
        <div className="space-y-4">
          {mockParticipants.map((participant) => (
            <Participant key={participant.name} {...participant} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Details;
