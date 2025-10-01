import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRoomsCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// POST /api/rooms/[id]/leave - Leave a room
export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roomId = params.id;
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

    // For now, we'll just decrement the participant count
    // In a real app, you might want to track individual participants
    const result = await roomsCollection.updateOne(
      { _id: new ObjectId(roomId) },
      {
        $inc: { currentParticipants: -1 },
        $set: { updatedAt: new Date() },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Successfully left the room" });
  } catch (error) {
    console.error("Error leaving room:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
