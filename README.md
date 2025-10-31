# Touch Type Pro

A web application designed to help users improve their typing speed and accuracy through interactive lessons and real-time feedback.

## Features

- **Interactive Typing Tests** - Practice with random text and track your progress
- **Real-time Performance Tracking** - WPM, accuracy, and error metrics
- **Multiplayer Challenges** - Race against friends in real-time
- **Comprehensive Typing Lessons** - Learn proper typing techniques
- **Live Race Updates** - See your opponents' progress in real-time
- **Countdown Timer** - Synchronized race starts
- **Results Sharing** - Share your achievements

## Technologies Used

### Frontend

- Next.js 14+ (App Router)
- TypeScript
- Socket.IO Client
- Tailwind CSS

### Backend

- Node.js
- Express.js
- Socket.IO Server
- TypeScript

---

## Getting Started

Touch Type Pro consists of two separate applications that work together:

### 🐳 Quick Start with Docker (Recommended)

The easiest way to run the entire application with all services:

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Start all services (PostgreSQL, Backend, Frontend)
docker-compose up -d --build

# 3. Open your browser
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000
```

The `docker-compose.yml` file in the root directory orchestrates two services:

- **Backend server** - Socket.IO and REST API on port 4000
- **Frontend application** - Next.js app on port 3000

Each service (frontend and backend) has its own `Dockerfile` in its respective folder for containerization.

### 💻 Manual Setup (Development)

For local development without Docker:

#### Backend (Socket.IO Server)

The backend handles all multiplayer race logic and WebSocket connections.

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

See the [Backend README](./backend/README.md) for detailed setup instructions.

#### Frontend (Next.js App)

The frontend provides the user interface and typing experience.

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if needed
npm run dev
```

See the [Frontend README](./frontend/README.md) for detailed setup instructions.

---

## Usage

### With Docker

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Local Development

Start both servers for local development:

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:4000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:3000`

Then open your browser and navigate to `http://localhost:3000`.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
