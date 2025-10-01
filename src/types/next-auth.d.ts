import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      mongoId?: string; // MongoDB ObjectId as string
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    mongoId?: string; // MongoDB ObjectId as string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    mongoId?: string; // MongoDB ObjectId as string
  }
}
