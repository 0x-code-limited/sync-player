import { ObjectId } from "mongodb";

export interface Room {
  _id: ObjectId;
  name: string;
  description?: string;
  ownerId: string;
  isPublic: boolean;
  maxParticipants?: number;
  currentParticipants: number;
  createdAt: Date;
  updatedAt: Date;
  videoUrl?: string;
  settings?: {
    allowGuests: boolean;
    requireApproval: boolean;
    autoStart: boolean;
  };
}

export interface CreateRoomData {
  name: string;
  description?: string;
  isPublic?: boolean;
  maxParticipants?: number;
  videoUrl?: string;
  settings?: {
    allowGuests?: boolean;
    requireApproval?: boolean;
    autoStart?: boolean;
  };
}

export interface UpdateRoomData {
  name?: string;
  description?: string;
  isPublic?: boolean;
  maxParticipants?: number;
  videoUrl?: string;
  settings?: {
    allowGuests?: boolean;
    requireApproval?: boolean;
    autoStart?: boolean;
  };
}

export interface RoomListResponse {
  rooms: Room[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface RoomFilters {
  search?: string;
  isPublic?: boolean;
  ownerId?: string;
  page?: number;
  limit?: number;
}
