export enum SocketEvent {
  // Client -> Server Events
  CREATE_RACE = 'create_race',
  JOIN_RACE = 'join_race',
  LEAVE_RACE = 'leave_race',
  PROGRESS_UPDATE = 'progress_update',
  RACE_FINISHED = 'race_finished',
  START_RACE = 'start_race',
  INITIATE_COUNTDOWN = 'initiate_countdown',
  CANCEL_COUNTDOWN = 'cancel_countdown',
  RESET_RACE = 'reset_race',
  REQUEST_REMATCH = 'request_rematch',
  ACCEPT_REMATCH = 'accept_rematch',
  DECLINE_REMATCH = 'decline_rematch',
  
  // Heartbeat Events
  PING = 'ping',
  PONG = 'pong',
  
  // Server -> Client Events
  ROOM_JOINED = 'room_joined',
  USER_JOINED = 'user_joined',
  USER_LEFT = 'user_left',
  PROGRESS_BROADCAST = 'progress_broadcast',
  RACE_COMPLETED = 'race_completed',
  RACE_STARTED = 'race_started',
  COUNTDOWN_STARTED = 'countdown_started',
  COUNTDOWN_TICK = 'countdown_tick',
  COUNTDOWN_CANCELLED = 'countdown_cancelled',
  COUNTDOWN_REJECTED = 'countdown_rejected',
  RACE_RESET = 'race_reset',
  REMATCH_REQUESTED = 'rematch_requested',
  REMATCH_ACCEPTED = 'rematch_accepted',
  REMATCH_DECLINED = 'rematch_declined',
  JOIN_ERROR = 'join_error',
  
  // System Events
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
}

// Payload types for client -> server events
export interface ClientToServerEvents {
  [SocketEvent.CREATE_RACE]: (payload: string | { roomId: string; username?: string }) => void;
  [SocketEvent.JOIN_RACE]: (payload: string | { roomId: string; username?: string }) => void;
  [SocketEvent.LEAVE_RACE]: (roomId: string) => void;
  [SocketEvent.PROGRESS_UPDATE]: (data: { roomId: string; progress: number }) => void;
  [SocketEvent.RACE_FINISHED]: (data: { 
    roomId: string; 
    wpm: number; 
    accuracy: number; 
    errors: number; 
    finishTime: number;
  }) => void;
  [SocketEvent.START_RACE]: (roomId: string) => void;
  [SocketEvent.INITIATE_COUNTDOWN]: (data: { roomId: string; duration: number }) => void;
  [SocketEvent.CANCEL_COUNTDOWN]: (data: { roomId: string }) => void;
  [SocketEvent.RESET_RACE]: (roomId: string) => void;
  [SocketEvent.REQUEST_REMATCH]: (roomId: string) => void;
  [SocketEvent.ACCEPT_REMATCH]: (roomId: string) => void;
  [SocketEvent.DECLINE_REMATCH]: (roomId: string) => void;
  [SocketEvent.PONG]: () => void;
}

// Payload types for server -> client events
export interface ServerToClientEvents {
  [SocketEvent.ROOM_JOINED]: (data: { 
    roomId: string; 
    text: string[]; 
    userCount: number; 
    isStarted: boolean; 
    existingUsers: string[];
    usersMeta: Array<{ playerId: string; username: string }>;
  }) => void;
  [SocketEvent.USER_JOINED]: (data: { 
    message: string; 
    playerId: string; 
    userCount: number; 
    username?: string;
  }) => void;
  [SocketEvent.USER_LEFT]: (data: { 
    message: string; 
    playerId: string; 
    userCount: number; 
    username?: string;
  }) => void;
  [SocketEvent.PROGRESS_BROADCAST]: (data: { 
    playerId: string; 
    progress: number; 
    username?: string;
  }) => void;
  [SocketEvent.RACE_COMPLETED]: (data: { 
    playerId: string; 
    wpm: number; 
    accuracy: number; 
    errors: number; 
    finishTime: number;
  }) => void;
  [SocketEvent.RACE_STARTED]: (data: { 
    message: string; 
    text: string[]; 
    startTime: number;
  }) => void;
  [SocketEvent.COUNTDOWN_STARTED]: (data: { 
    duration: number; 
    initiator: string; 
    endsAt: number;
  }) => void;
  [SocketEvent.COUNTDOWN_TICK]: (data: { remaining: number }) => void;
  [SocketEvent.COUNTDOWN_CANCELLED]: (data: { by: string }) => void;
  [SocketEvent.COUNTDOWN_REJECTED]: (data: { reason: string }) => void;
  [SocketEvent.RACE_RESET]: (data: { roomId: string; text: string[] }) => void;
  [SocketEvent.REMATCH_REQUESTED]: (data: { requesterId: string; requesterName: string }) => void;
  [SocketEvent.REMATCH_ACCEPTED]: (data: { accepterId: string; accepterName: string }) => void;
  [SocketEvent.REMATCH_DECLINED]: (data: { declinerId: string; declinerName: string }) => void;
  [SocketEvent.JOIN_ERROR]: (data: { roomId: string; message: string }) => void;
  [SocketEvent.PING]: () => void;
}

// Socket data interface for storing per-socket metadata
export interface SocketData {
  lastHeartbeat: number;
  userId?: string;
  username?: string;
}