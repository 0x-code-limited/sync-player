import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRoomsCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// POST /api/rooms/[id]/join - Join a room
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId } = await params;
    const userId = (session.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(roomId)) {
      return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
    }

    const roomsCollection = await getRoomsCollection();
    const room = await roomsCollection.findOne({ _id: new ObjectId(roomId) });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check if room is public or user is owner
    if (!room.isPublic && room.ownerId !== userId) {
      return NextResponse.json(
        { error: "Access denied. This is a private room." },
        { status: 403 }
      );
    }

    // Check if room has space
    if (
      room.maxParticipants &&
      room.currentParticipants >= room.maxParticipants
    ) {
      return NextResponse.json({ error: "Room is full" }, { status: 400 });
    }

    // For now, we'll just increment the participant count
    // In a real app, you might want to track individual participants
    const result = await roomsCollection.updateOne(
      { _id: new ObjectId(roomId) },
      {
        $inc: { currentParticipants: 1 },
        $set: { updatedAt: new Date() },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Fetch updated room
    const updatedRoom = await roomsCollection.findOne({
      _id: new ObjectId(roomId),
    });

    // Convert ObjectId to string and dates to ISO strings
    const roomWithStringId = {
      ...updatedRoom,
      _id: updatedRoom!._id.toString(),
      createdAt: updatedRoom!.createdAt.toISOString(),
      updatedAt: updatedRoom!.updatedAt.toISOString(),
    };

    return NextResponse.json(roomWithStringId);
  } catch (error) {
    console.error("Error joining room:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
