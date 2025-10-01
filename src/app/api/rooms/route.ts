import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  Room,
  CreateRoomData,
  RoomListResponse,
  RoomFilters,
} from "@/types/room";
import { getRoomsCollection } from "@/lib/mongodb";

// GET /api/rooms - Get all rooms (public + user-owned if authenticated)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);

    const filters: RoomFilters = {
      search: searchParams.get("search") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
    };

    const roomsCollection = await getRoomsCollection();

    // Build MongoDB query for both public rooms and user-owned rooms
    const query: Record<string, unknown> = {
      $or: [
        { isPublic: true }, // All public rooms
        ...(session?.user
          ? [{ ownerId: (session.user as { id?: string })?.id }]
          : []), // User's owned rooms (only if authenticated)
      ],
    };

    // Add search filter if provided
    if (filters.search) {
      query.$and = [
        {
          $or: [
            { name: { $regex: filters.search, $options: "i" } },
            { description: { $regex: filters.search, $options: "i" } },
          ],
        },
      ];
    }

    // Get total count for pagination
    const total = await roomsCollection.countDocuments(query);

    // Apply pagination
    const skip = (filters.page! - 1) * filters.limit!;
    const rooms = await roomsCollection
      .find(query)
      .skip(skip)
      .limit(filters.limit!)
      .sort({ createdAt: -1 })
      .toArray();

    // Convert ObjectIds to strings for JSON response
    const roomsWithIds: Room[] = rooms.map((room) => ({
      _id: room._id,
      name: room.name,
      description: room.description,
      ownerId: room.ownerId,
      isPublic: room.isPublic,
      maxParticipants: room.maxParticipants,
      currentParticipants: room.currentParticipants,
      createdAt: room.createdAt.toISOString(),
      updatedAt: room.updatedAt.toISOString(),
      settings: room.settings,
    }));

    const response: RoomListResponse = {
      rooms: roomsWithIds,
      total,
      page: filters.page!,
      limit: filters.limit!,
      hasMore: skip + filters.limit! < total,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/rooms - Create a new room
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log("🚀 ~ POST ~ session:", session);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateRoomData = await request.json();

    // Validate required fields
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: "Room name is required" },
        { status: 400 }
      );
    }

    const roomsCollection = await getRoomsCollection();

    // Create new room
    const newRoom = {
      name: body.name.trim(),
      description: body.description?.trim(),
      ownerId: (session.user as { id?: string })?.id || "unknown",
      isPublic: body.isPublic ?? true,
      maxParticipants: body.maxParticipants,
      currentParticipants: 1, // Owner is automatically a participant
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: {
        allowGuests: body.settings?.allowGuests ?? true,
        requireApproval: body.settings?.requireApproval ?? false,
        autoStart: body.settings?.autoStart ?? true,
      },
    };

    const result = await roomsCollection.insertOne(newRoom);

    // Convert the result to the expected format
    const createdRoom: Room = {
      ...newRoom,
      _id: result.insertedId,
      createdAt: newRoom.createdAt,
      updatedAt: newRoom.updatedAt,
    };

    return NextResponse.json(createdRoom, { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
