import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the raw JWT token string
    const rawToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      raw: true, // This returns the actual JWT string
    });

    // Get the decoded token object
    const decodedToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!rawToken) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    console.log("Raw token:", rawToken);
    console.log("Raw token type:", typeof rawToken);
    console.log("Token starts with:", rawToken?.substring(0, 50));
    console.log("Token length:", rawToken?.length);

    const tokenParts = typeof rawToken === "string" ? rawToken.split(".") : [];
    console.log("Token parts count:", tokenParts.length);
    console.log("First part:", tokenParts[0]?.substring(0, 20));

    return NextResponse.json({
      rawToken,
      decodedToken,
      tokenType: typeof rawToken,
      tokenLength: rawToken?.length,
      tokenParts: tokenParts.length,
      isJWT: typeof rawToken === "string" && tokenParts.length === 3,
      firstPart: tokenParts[0]?.substring(0, 20),
    });
  } catch (error) {
    console.error("Error getting token:", error);
    return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
  }
}
