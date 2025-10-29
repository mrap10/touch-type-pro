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
  LEADERBOARD_UPDATE = 'leaderboard_update',
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