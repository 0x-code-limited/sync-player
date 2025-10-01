import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UpdateRoomData } from "@/types/room";
import { getRoomsCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET /api/rooms/[id] - Get a single room by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId } = await params;

    // Validate ObjectId format
    if (!ObjectId.isValid(roomId)) {
      return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
    }

    const roomsCollection = await getRoomsCollection();
    const room = await roomsCollection.findOne({ _id: new ObjectId(roomId) });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check if user has access to the room
    if (
      !room.isPublic &&
      room.ownerId !== (session.user as { id?: string })?.id
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Convert ObjectId to string and dates to ISO strings
    const roomWithStringId = {
      ...room,
      _id: room._id.toString(),
      createdAt: room.createdAt.toISOString(),
      updatedAt: room.updatedAt.toISOString(),
    };

    return NextResponse.json(roomWithStringId);
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/rooms/[id] - Update an existing room
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId } = await params;
    const body: UpdateRoomData = await request.json();

    // Validate ObjectId format
    if (!ObjectId.isValid(roomId)) {
      return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
    }

    const roomsCollection = await getRoomsCollection();
    const room = await roomsCollection.findOne({ _id: new ObjectId(roomId) });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check if user is the owner
    if (room.ownerId !== (session.user as { id?: string })?.id) {
      return NextResponse.json(
        { error: "Only room owner can update the room" },
        { status: 403 }
      );
    }

    // Validate data
    if (body.name !== undefined && body.name.trim().length === 0) {
      return NextResponse.json(
        { error: "Room name cannot be empty" },
        { status: 400 }
      );
    }

    if (body.maxParticipants !== undefined && body.maxParticipants < 1) {
      return NextResponse.json(
        { error: "Max participants must be at least 1" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: Partial<{
      name: string;
      description?: string;
      isPublic: boolean;
      maxParticipants: number;
      updatedAt: Date;
      settings: {
        allowGuests: boolean;
        requireApproval: boolean;
        autoStart: boolean;
      };
    }> = {
      updatedAt: new Date(),
    };

    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.description !== undefined)
      updateData.description = body.description?.trim();
    if (body.isPublic !== undefined) updateData.isPublic = body.isPublic;
    if (body.maxParticipants !== undefined)
      updateData.maxParticipants = body.maxParticipants;

    if (body.settings !== undefined) {
      updateData.settings = {
        allowGuests:
          body.settings.allowGuests ?? room.settings?.allowGuests ?? true,
        requireApproval:
          body.settings.requireApproval ??
          room.settings?.requireApproval ??
          false,
        autoStart: body.settings.autoStart ?? room.settings?.autoStart ?? true,
      };
    }

    // Update room in MongoDB
    const result = await roomsCollection.updateOne(
      { _id: new ObjectId(roomId) },
      { $set: updateData }
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
    console.error("Error updating room:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/rooms/[id] - Delete a room
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId } = await params;

    // Validate ObjectId format
    if (!ObjectId.isValid(roomId)) {
      return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
    }

    const roomsCollection = await getRoomsCollection();
    const room = await roomsCollection.findOne({ _id: new ObjectId(roomId) });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check if user is the owner
    if (room.ownerId !== (session.user as { id?: string })?.id) {
      return NextResponse.json(
        { error: "Only room owner can delete the room" },
        { status: 403 }
      );
    }

    // Delete room from MongoDB
    const result = await roomsCollection.deleteOne({
      _id: new ObjectId(roomId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
