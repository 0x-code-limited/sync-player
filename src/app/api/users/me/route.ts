import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUsersCollection } from "@/lib/mongodb";

// GET /api/users/me - Get current user's data from MongoDB
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({
      $or: [{ id: session.user.id }, { email: session.user.email }],
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user data (excluding sensitive fields)
    const userData = {
      _id: user._id.toString(),
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      provider: user.provider,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString(),
      profile: user.profile,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/users/me - Update current user's profile data
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { profile } = body;

    if (!profile || typeof profile !== "object") {
      return NextResponse.json(
        { error: "Invalid profile data" },
        { status: 400 }
      );
    }

    const usersCollection = await getUsersCollection();
    const result = await usersCollection.updateOne(
      {
        $or: [{ id: session.user.id }, { email: session.user.email }],
      },
      {
        $set: {
          profile,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
