import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roomApi } from "@/lib/api/room";
import {
  Room,
  CreateRoomData,
  UpdateRoomData,
  RoomFilters,
} from "@/types/room";
import { useAuth } from "./useAuth";

// Query keys for consistent caching
export const roomKeys = {
  all: ["rooms"] as const,
  lists: () => [...roomKeys.all, "list"] as const,
  list: (filters: RoomFilters) => [...roomKeys.lists(), filters] as const,
  details: () => [...roomKeys.all, "detail"] as const,
  detail: (id: string) => [...roomKeys.details(), id] as const,
  userRooms: (userId: string) => [...roomKeys.all, "user", userId] as const,
};

export const useRooms = (filters: RoomFilters = {}) => {
  return useQuery({
    queryKey: roomKeys.list(filters),
    queryFn: () => roomApi.getRooms(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRoom = (id: string) => {
  return useQuery({
    queryKey: roomKeys.detail(id),
    queryFn: () => roomApi.getRoom(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useUserRooms = (userId: string) => {
  return useQuery({
    queryKey: roomKeys.userRooms(userId),
    queryFn: () => roomApi.getUserRooms(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: (data: CreateRoomData) => roomApi.createRoom(data),
    onSuccess: (newRoom) => {
      // Invalidate and refetch room lists
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });

      // Add the new room to the user's rooms cache
      const userId = (session?.user as { id?: string })?.id;
      if (userId) {
        queryClient.setQueryData(
          roomKeys.userRooms(userId),
          (old: Room[] | undefined) => (old ? [newRoom, ...old] : [newRoom])
        );
      }
    },
    onError: (error) => {
      console.error("Failed to create room:", error);
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoomData }) => {
      return roomApi.updateRoom(id, data);
    },
    onSuccess: (updatedRoom) => {
      // Update the specific room in cache
      queryClient.setQueryData(
        roomKeys.detail(updatedRoom._id.toString()),
        updatedRoom
      );

      // Invalidate room lists to refetch
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });

      // Update user rooms if it exists in cache
      queryClient.setQueryData(
        roomKeys.userRooms(updatedRoom.ownerId),
        (old: Room[] | undefined) =>
          old
            ? old.map((room) =>
                room._id === updatedRoom._id ? updatedRoom : room
              )
            : old
      );
    },
    onError: (error) => {
      console.error("Failed to update room:", error);
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: (id: string) => roomApi.deleteRoom(id),
    onSuccess: (_, deletedId) => {
      // Remove from all caches
      queryClient.removeQueries({ queryKey: roomKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });

      // Update user rooms cache
      const userId = (session?.user as { id?: string })?.id;
      if (userId) {
        queryClient.setQueryData(
          roomKeys.userRooms(userId),
          (old: Room[] | undefined) =>
            old ? old.filter((room) => room._id.toString() !== deletedId) : old
        );
      }
    },
    onError: (error) => {
      console.error("Failed to delete room:", error);
    },
  });
};

export const useJoinRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roomApi.joinRoom(id),
    onSuccess: (updatedRoom) => {
      // Update the room in cache
      queryClient.setQueryData(
        roomKeys.detail(updatedRoom._id.toString()),
        updatedRoom
      );

      // Invalidate room lists to show updated participant count
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to join room:", error);
    },
  });
};

export const useLeaveRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roomApi.leaveRoom(id),
    onSuccess: (_, roomId) => {
      // Invalidate room data to refetch updated participant count
      queryClient.invalidateQueries({ queryKey: roomKeys.detail(roomId) });
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to leave room:", error);
    },
  });
};

// Custom hook that combines multiple room operations
export const useRoomOperations = () => {
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();
  const joinRoom = useJoinRoom();
  const leaveRoom = useLeaveRoom();

  return {
    createRoom: createRoom.mutate,
    updateRoom: updateRoom.mutate,
    deleteRoom: deleteRoom.mutate,
    joinRoom: joinRoom.mutate,
    leaveRoom: leaveRoom.mutate,
    isCreating: createRoom.isPending,
    isUpdating: updateRoom.isPending,
    isDeleting: deleteRoom.isPending,
    isJoining: joinRoom.isPending,
    isLeaving: leaveRoom.isPending,
    createError: createRoom.error,
    updateError: updateRoom.error,
    deleteError: deleteRoom.error,
    joinError: joinRoom.error,
    leaveError: leaveRoom.error,
  };
};
