# Room Hooks Documentation

This directory contains React Query-based hooks for managing room operations in the Sync Player application.

## Overview

The room hooks provide a complete CRUD interface for managing rooms with MongoDB backend integration. They use React Query for caching, background updates, and optimistic updates.

## Available Hooks

### Query Hooks

#### `useRooms(filters?)`

Fetches a list of rooms with optional filtering.

```typescript
const { data, isLoading, error } = useRooms({
  search: "gaming",
  isPublic: true,
  page: 1,
  limit: 10,
});
```

**Parameters:**

- `filters` (optional): `RoomFilters` object with search, pagination, and filtering options

**Returns:**

- `data`: `RoomListResponse` with rooms array and pagination info
- `isLoading`: boolean indicating loading state
- `error`: any error that occurred

#### `useRoom(id)`

Fetches a single room by ID.

```typescript
const { data: room, isLoading, error } = useRoom("room-id-123");
```

**Parameters:**

- `id`: string - Room ID

**Returns:**

- `data`: `Room` object
- `isLoading`: boolean indicating loading state
- `error`: any error that occurred

#### `useUserRooms(userId)`

Fetches all rooms owned by a specific user.

```typescript
const { data: userRooms, isLoading, error } = useUserRooms("user-id-123");
```

**Parameters:**

- `userId`: string - User ID

**Returns:**

- `data`: Array of `Room` objects
- `isLoading`: boolean indicating loading state
- `error`: any error that occurred

### Mutation Hooks

#### `useCreateRoom()`

Creates a new room.

```typescript
const createRoom = useCreateRoom();

const handleCreate = () => {
  createRoom.mutate({
    name: "My Gaming Room",
    description: "A room for gaming together",
    isPublic: true,
    maxParticipants: 10,
    settings: {
      allowGuests: true,
      requireApproval: false,
      autoStart: true,
    },
  });
};
```

**Returns:**

- `mutate`: function to create room
- `isPending`: boolean indicating mutation is in progress
- `error`: any error that occurred
- `data`: created room data on success

#### `useUpdateRoom()`

Updates an existing room.

```typescript
const updateRoom = useUpdateRoom();

const handleUpdate = () => {
  updateRoom.mutate({
    id: "room-id-123",
    data: {
      name: "Updated Room Name",
      description: "New description",
    },
  });
};
```

**Returns:**

- `mutate`: function to update room
- `isPending`: boolean indicating mutation is in progress
- `error`: any error that occurred
- `data`: updated room data on success

#### `useDeleteRoom()`

Deletes a room.

```typescript
const deleteRoom = useDeleteRoom();

const handleDelete = () => {
  deleteRoom.mutate("room-id-123");
};
```

**Returns:**

- `mutate`: function to delete room
- `isPending`: boolean indicating mutation is in progress
- `error`: any error that occurred

#### `useJoinRoom()`

Joins a room.

```typescript
const joinRoom = useJoinRoom();

const handleJoin = () => {
  joinRoom.mutate("room-id-123");
};
```

**Returns:**

- `mutate`: function to join room
- `isPending`: boolean indicating mutation is in progress
- `error`: any error that occurred
- `data`: updated room data on success

#### `useLeaveRoom()`

Leaves a room.

```typescript
const leaveRoom = useLeaveRoom();

const handleLeave = () => {
  leaveRoom.mutate("room-id-123");
};
```

**Returns:**

- `mutate`: function to leave room
- `isPending`: boolean indicating mutation is in progress
- `error`: any error that occurred

### Combined Hook

#### `useRoomOperations()`

A convenience hook that combines all room operations.

```typescript
const {
  createRoom,
  updateRoom,
  deleteRoom,
  joinRoom,
  leaveRoom,
  isCreating,
  isUpdating,
  isDeleting,
  isJoining,
  isLeaving,
  createError,
  updateError,
  deleteError,
  joinError,
  leaveError,
} = useRoomOperations();
```

## Data Types

### Room

```typescript
interface Room {
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
```

### CreateRoomData

```typescript
interface CreateRoomData {
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
```

### UpdateRoomData

```typescript
interface UpdateRoomData {
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
```

### RoomFilters

```typescript
interface RoomFilters {
  search?: string;
  isPublic?: boolean;
  ownerId?: string;
  page?: number;
  limit?: number;
}
```

## Caching Strategy

The hooks use React Query's intelligent caching with the following strategy:

- **Stale Time**: 5 minutes - data is considered fresh for 5 minutes
- **Garbage Collection Time**: 10 minutes - unused data is kept in cache for 10 minutes
- **Background Refetch**: Disabled for better performance
- **Retry Logic**:
  - Queries: Up to 3 retries, no retry on 4xx errors
  - Mutations: Up to 2 retries, no retry on 4xx errors

## Cache Invalidation

The hooks automatically handle cache invalidation:

- Creating a room invalidates room lists and updates user rooms cache
- Updating a room updates the specific room cache and invalidates lists
- Deleting a room removes it from all caches
- Joining/leaving a room updates participant counts in relevant caches

## Error Handling

All hooks provide error states that can be used to display error messages to users:

```typescript
const { data, error, isLoading } = useRooms();

if (error) {
  return <div>Error: {error.message}</div>;
}
```

## Example Usage

See `src/components/examples/RoomExample.tsx` for a complete example of how to use all the room hooks in a React component.

## API Configuration

The hooks expect the API to be available at the URL specified in `NEXT_PUBLIC_API_URL` environment variable (defaults to `http://localhost:3001/api`).

The API should implement the following endpoints:

- `GET /api/rooms` - List rooms with filtering
- `GET /api/rooms/:id` - Get single room
- `POST /api/rooms` - Create room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room
- `POST /api/rooms/:id/join` - Join room
- `POST /api/rooms/:id/leave` - Leave room
- `GET /api/users/:userId/rooms` - Get user's rooms
