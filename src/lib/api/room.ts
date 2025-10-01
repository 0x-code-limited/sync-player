import axios from "axios";
import {
  Room,
  CreateRoomData,
  UpdateRoomData,
  RoomListResponse,
  RoomFilters,
} from "@/types/room";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const roomApi = {
  // Get all rooms with optional filters
  getRooms: async (filters: RoomFilters = {}): Promise<RoomListResponse> => {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.isPublic !== undefined)
      params.append("isPublic", filters.isPublic.toString());
    if (filters.ownerId) params.append("ownerId", filters.ownerId);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const response = await api.get(`/rooms?${params.toString()}`);
    return response.data;
  },

  // Get a single room by ID
  getRoom: async (id: string): Promise<Room> => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  // Create a new room
  createRoom: async (data: CreateRoomData): Promise<Room> => {
    const response = await api.post("/rooms", data);
    return response.data;
  },

  // Update an existing room
  updateRoom: async (id: string, data: UpdateRoomData): Promise<Room> => {
    const response = await api.put(`/rooms/${id}`, data);
    return response.data;
  },

  // Delete a room
  deleteRoom: async (id: string): Promise<void> => {
    await api.delete(`/rooms/${id}`);
  },

  // Join a room
  joinRoom: async (id: string): Promise<Room> => {
    const response = await api.post(`/rooms/${id}/join`);
    return response.data;
  },

  // Leave a room
  leaveRoom: async (id: string): Promise<void> => {
    await api.post(`/rooms/${id}/leave`);
  },

  // Get user's rooms
  getUserRooms: async (userId: string): Promise<Room[]> => {
    const response = await api.get(`/users/${userId}/rooms`);
    return response.data;
  },
};

export default roomApi;
