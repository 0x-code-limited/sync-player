export interface Room {
  _id: string;
  name: string;
  description?: string;
  ownerId: string;
  isPublic: boolean;
  maxParticipants?: number;
  currentParticipants: number;
  createdAt: string;
  updatedAt: string;
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
