import { ObjectId } from "mongodb";

export interface User {
  _id: ObjectId;
  id: string; // NextAuth user ID
  email: string;
  name: string;
  image?: string;
  provider: string; // e.g., "google"
  providerId: string; // Provider-specific ID
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  profile?: {
    displayName?: string;
    bio?: string;
    preferences?: {
      theme?: "light" | "dark" | "system";
      notifications?: boolean;
    };
  };
}

export interface CreateUserData {
  id: string;
  email: string;
  name: string;
  image?: string;
  provider: string;
  providerId: string;
}
