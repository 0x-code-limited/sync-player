"use client";
import { useRoom } from "@/hooks/useRoom";
import { useParams } from "next/navigation";
import React from "react";

type Props = {};

const RoomPage = (props: Props) => {
  const { id } = useParams();
  const { data: room } = useRoom(id as string);
  return (
    <div>
      <h1 className="text-2xl font-bold">{room?.name}</h1>
    </div>
  );
};

export default RoomPage;
