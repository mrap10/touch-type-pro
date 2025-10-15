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

### Backend (Socket.IO Server)

The backend handles all multiplayer race logic and WebSocket connections.

```bash
cd backend
npm install
npm run dev
```

See the [Backend README](./backend/README.md) for detailed setup instructions.

### Frontend (Next.js App)

The frontend provides the user interface and typing experience.

```bash
cd frontend
npm install
npm run dev
```

See the [Frontend README](./frontend/README.md) for detailed setup instructions.

### Quick Setup

For a complete setup, clone the repository and follow these steps:

```bash
git clone https://github.com/yourusername/touch-type-pro.git
cd touch-type-pro

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env if needed
cd ..

# Setup frontend
cd frontend
npm install
cp .env.example .env
# Edit .env if needed
cd ..
```

---

## Usage

### Development

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
