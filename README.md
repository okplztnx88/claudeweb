# ClaudeWeb

A production-ready, full-stack chat application powered by Claude AI. Built with modern technologies and best practices.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Node.js](https://img.shields.io/badge/Node.js-20-green)

## Features

- **Real-time Chat**: WebSocket-based real-time communication with Claude AI
- **Authentication**: Secure JWT-based user authentication
- **Modern UI**: Beautiful, responsive interface built with Next.js 14 and Tailwind CSS
- **TypeScript**: Full type safety across the entire stack
- **Database**: PostgreSQL with Prisma ORM for data persistence
- **Caching**: Redis for session management and caching
- **Rate Limiting**: Built-in rate limiting and security features
- **Docker Support**: Full containerization with docker-compose
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Monitoring**: Structured logging with Winston
- **Testing**: Comprehensive test suite with Jest and Vitest

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components
- **Zustand** for state management
- **Socket.io Client** for real-time communication
- **React Markdown** for message rendering

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **Socket.io** for WebSockets
- **Prisma ORM** with PostgreSQL
- **Redis** for caching
- **JWT** authentication
- **Winston** logging
- **Helmet** & **CORS** for security

### DevOps
- **Docker** & **docker-compose**
- **pnpm** & **Turbo** for monorepo management
- **GitHub Actions** for CI/CD
- **Trivy** for security scanning

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker & docker-compose (optional)
- PostgreSQL 16 (if not using Docker)
- Redis 7 (if not using Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/claudeweb.git
   cd claudeweb
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration:
   - `ANTHROPIC_API_KEY`: Your Claude API key
   - `DATABASE_URL`: PostgreSQL connection string
   - `REDIS_URL`: Redis connection string
   - `JWT_SECRET`: Secret for JWT signing

4. **Start with Docker (Recommended)**
   ```bash
   pnpm docker:up
   ```

5. **Or start manually**
   ```bash
   # Start database
   pnpm db:migrate

   # Start development servers
   pnpm dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Backend Health: http://localhost:3001/health

## Project Structure

```
claudeweb/
├── apps/
│   ├── backend/              # Express API server
│   │   ├── prisma/          # Database schema & migrations
│   │   ├── src/
│   │   │   ├── routes/      # API routes
│   │   │   ├── services/    # Business logic
│   │   │   ├── middleware/  # Express middleware
│   │   │   ├── socket/      # Socket.io handlers
│   │   │   ├── utils/       # Utilities
│   │   │   └── __tests__/   # Backend tests
│   │   └── Dockerfile
│   │
│   └── frontend/            # Next.js application
│       ├── src/
│       │   ├── app/         # Next.js app directory
│       │   ├── components/  # React components
│       │   ├── lib/         # Utilities & API client
│       │   └── __tests__/   # Frontend tests
│       └── Dockerfile
│
├── .github/
│   └── workflows/           # GitHub Actions CI/CD
├── docker-compose.yml       # Docker orchestration
├── turbo.json              # Turborepo configuration
└── package.json            # Root package.json
```

## Development

### Available Scripts

```bash
# Development
pnpm dev                    # Start all apps in dev mode
pnpm dev:backend           # Start backend only
pnpm dev:frontend          # Start frontend only

# Building
pnpm build                 # Build all apps
pnpm build:backend         # Build backend only
pnpm build:frontend        # Build frontend only

# Testing
pnpm test                  # Run all tests
pnpm test:watch           # Run tests in watch mode
pnpm test:coverage        # Generate coverage report

# Linting & Formatting
pnpm lint                  # Lint all apps
pnpm format               # Format code with Prettier

# Database
pnpm db:migrate           # Run database migrations
pnpm db:generate          # Generate Prisma client
pnpm db:studio            # Open Prisma Studio

# Docker
pnpm docker:up            # Start all services
pnpm docker:down          # Stop all services
pnpm docker:build         # Build Docker images

# Cleanup
pnpm clean                # Clean build artifacts
```

## API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Conversations

#### Get All Conversations
```http
GET /api/conversations
Authorization: Bearer <token>
```

#### Create Conversation
```http
POST /api/conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Conversation"
}
```

### Socket.io Events

#### Client → Server

- `chat:message` - Send a chat message
- `conversation:join` - Join a conversation room
- `conversation:leave` - Leave a conversation room
- `chat:typing` - Typing indicator

#### Server → Client

- `chat:message` - New message received
- `chat:stream` - Streaming message chunk
- `chat:complete` - Message streaming complete
- `chat:error` - Error occurred

## Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Anthropic](https://anthropic.com) for Claude AI
- [Next.js](https://nextjs.org) team
- [Prisma](https://prisma.io) team
- [shadcn/ui](https://ui.shadcn.com) for beautiful components

---

Built with ❤️ using Claude AI
