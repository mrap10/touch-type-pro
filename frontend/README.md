# Touch Type Pro - Frontend

Next.js frontend application for Touch Type Pro multiplayer typing races.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Socket Client:** Socket.IO Client
- **UI Components:** Custom React components

## Quick Start

### Option 1: Docker (Recommended)

The frontend includes a `Dockerfile` for containerized deployment:

```bash
# Build the Docker image
docker build -t touch-type-pro-frontend .

# Run the container
docker run -p 3000:3000 --env-file .env touch-type-pro-frontend
```

Or use the root `docker-compose.yml` to run all services together:

```bash
# From the project root
docker-compose up -d
```

### Option 2: Local Development

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Configure Environment

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Update the `.env` file:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

#### 3. Start Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

**Note:** Make sure the backend server is running on port 4000 before starting the frontend!

## Key Features

### 1. Solo Typing Practice (`/type`)

Here users can practice typing individually with various texts and difficulty levels.

### 2. Multiplayer Racing (`/race`)

In this mode, users can compete against each other in real-time typing races. The server handles all the WebSocket connections and race logic.

### 3. Learning Mode (`/learn`)

Provides structured lessons to help users improve their typing skills progressively both in normal and developer modes.

## Contributing

When adding new features:

1. Create types in `src/types/`
2. Add components in `src/components/`
3. Use custom hooks for logic
4. Follow existing code style
5. Test with both backend and frontend running

## Links

- [Backend README](../backend/README.md)
- [Main README](../README.md)

## Support

For issues or questions, please refer to the main project documentation.
