import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Room } from "@/types/room";
import { getRoomsCollection } from "@/lib/mongodb";

// GET /api/users/[userId]/rooms - Get user's rooms (owned and participated)
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestedUserId = params.userId;
    const currentUserId = (session.user as { id?: string })?.id;

    // Users can only view their own rooms unless they have admin privileges
    if (requestedUserId !== currentUserId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const roomsCollection = await getRoomsCollection();

    // Get rooms owned by the user
    const ownedRooms = await roomsCollection
      .find({ ownerId: requestedUserId })
      .sort({ createdAt: -1 })
      .toArray();

    // For now, we'll only return owned rooms
    // In a real app, you might want to track participants separately
    const userRooms = ownedRooms.map((room) => ({
      ...room,
      _id: room._id.toString(),
      createdAt: room.createdAt.toISOString(),
      updatedAt: room.updatedAt.toISOString(),
    }));

    return NextResponse.json(userRooms);
  } catch (error) {
    console.error("Error fetching user rooms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
