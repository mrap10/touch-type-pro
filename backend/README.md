# TouchTypePro - Backend

Socket.IO backend server for Touch Type Pro multiplayer typing races.

## Setup

1.Install dependencies:

```bash
npm install
```

2.Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

3.Update the `.env` file with your configuration:

```env
PORT=4000
ALLOWED_ORIGINS=http://localhost:3000
```

## Development

Run the development server:

```bash
npm run dev
```

The server will start on `http://localhost:4000`

## Socket Events

### Client -> Server

- `create_race` - Create a new race room
- `join_race` - Join an existing race room
- `leave_race` - Leave a race room
- `start_race` - Start the race
- `initiate_countdown` - Start countdown before race
- `cancel_countdown` - Cancel countdown
- `progress_update` - Update typing progress
- `race_finished` - Finish the race
- `reset_race` - Reset the race

### Server -> Client

- `room_joined` - Confirmation of room join
- `user_joined` - Another user joined
- `user_left` - A user left
- `race_started` - Race has started
- `countdown_started` - Countdown initiated
- `countdown_tick` - Countdown tick
- `countdown_cancelled` - Countdown cancelled
- `progress_broadcast` - Other user's progress
- `race_completed` - Another user finished
- `race_reset` - Race was reset
- `join_error` - Error joining room

## Links

- [Frontend README](../frontend/README.md)
- [Main README](../README.md)

## Support

For issues or questions, please refer to the main project documentation.
