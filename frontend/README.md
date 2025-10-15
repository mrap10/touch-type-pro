# Touch Type Pro - Frontend

Next.js frontend application for Touch Type Pro multiplayer typing races.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Socket Client:** Socket.IO Client
- **UI Components:** Custom React components

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env.local` file (copy from `.env.local.example`):

```bash
cp .env.local.example .env.local
```

Update the `.env.local` file:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

### 3. Start Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

**Note:** Make sure the backend server is running on port 4000 before starting the frontend!

## Key Features

### 1. Solo Typing Practice (`/type`)

### 2. Multiplayer Racing (`/race`)

### 3. Learning Mode (`/learn`)

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
