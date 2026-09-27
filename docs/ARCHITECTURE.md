# Architecture Documentation

## System Overview

ClaudeWeb is a full-stack, real-time chat application built as a monorepo using modern web technologies. The system consists of three main components:

1. **Frontend** - Next.js 14 application
2. **Backend** - Express.js API server with Socket.io
3. **Infrastructure** - PostgreSQL, Redis, and supporting services

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Pages   │  │  Chat UI     │  │  Components  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
              HTTP  │             │  WebSocket
                    │             │
┌───────────────────┴─────────────┴───────────────────────────┐
│                    Backend (Express + Socket.io)             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ REST API     │  │  Socket.io   │  │  Auth/JWT    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                          │                                   │
│         ┌────────────────┼────────────────┐                 │
│         │                │                │                 │
└─────────┼────────────────┼────────────────┼─────────────────┘
          │                │                │
     ┌────▼────┐      ┌────▼────┐     ┌────▼────┐
     │PostgreSQL│      │  Redis  │     │ Claude  │
     │   DB     │      │  Cache  │     │   API   │
     └──────────┘      └─────────┘     └─────────┘
```

## Component Details

### Frontend Architecture

**Technology Stack:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (State Management)
- Socket.io Client

**Key Features:**
- Server-side rendering (SSR) for auth pages
- Client-side rendering for chat interface
- Real-time updates via WebSocket
- Optimistic UI updates
- Persistent state with localStorage

**File Structure:**
```
apps/frontend/src/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── chat/              # Chat interface
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── chat/             # Chat-specific components
└── lib/                   # Utilities
    ├── api.ts            # API client
    ├── socket.ts         # Socket.io client
    └── store/            # Zustand stores
```

### Backend Architecture

**Technology Stack:**
- Node.js + Express
- TypeScript
- Socket.io
- Prisma ORM
- Redis

**Layered Architecture:**

1. **Routes Layer** (`src/routes/`)
   - HTTP endpoint definitions
   - Request validation
   - Response formatting

2. **Middleware Layer** (`src/middleware/`)
   - Authentication
   - Error handling
   - Rate limiting
   - Input validation

3. **Service Layer** (`src/services/`)
   - Business logic
   - External API integration (Claude)
   - Data transformation

4. **Socket Layer** (`src/socket/`)
   - WebSocket event handlers
   - Real-time communication
   - Broadcasting

5. **Data Layer** (Prisma)
   - Database access
   - Query optimization
   - Migrations

**File Structure:**
```
apps/backend/src/
├── routes/                # HTTP routes
│   ├── auth.ts
│   ├── conversations.ts
│   └── messages.ts
├── middleware/            # Express middleware
│   ├── auth.ts
│   ├── errorHandler.ts
│   └── rateLimiter.ts
├── services/             # Business logic
│   └── claude.ts
├── socket/               # Socket.io
│   ├── handlers.ts
│   └── chatHandler.ts
└── utils/                # Utilities
    ├── logger.ts
    ├── prisma.ts
    └── redis.ts
```

## Data Flow

### Authentication Flow

```
1. User submits credentials
   ↓
2. Frontend → POST /api/auth/login
   ↓
3. Backend validates credentials (bcrypt)
   ↓
4. Generate JWT token
   ↓
5. Return { user, token }
   ↓
6. Frontend stores in localStorage
   ↓
7. Include in Authorization header for future requests
```

### Chat Message Flow

```
1. User types message
   ↓
2. Frontend → socket.emit('chat:message', data)
   ↓
3. Backend authenticates socket connection
   ↓
4. Save user message to database
   ↓
5. Backend → socket.emit('chat:message', userMessage)
   ↓
6. Call Claude API (streaming)
   ↓
7. For each chunk → socket.emit('chat:stream', chunk)
   ↓
8. Save assistant message to database
   ↓
9. Backend → socket.emit('chat:complete', message)
   ↓
10. Frontend updates UI
```

## Database Schema

### User
- id (String, PK)
- email (String, unique)
- username (String, unique)
- password (String, hashed)
- createdAt (DateTime)
- updatedAt (DateTime)

### Conversation
- id (String, PK)
- title (String)
- userId (String, FK → User)
- createdAt (DateTime)
- updatedAt (DateTime)

### Message
- id (String, PK)
- conversationId (String, FK → Conversation)
- userId (String, FK → User)
- role (String: 'user' | 'assistant')
- content (Text)
- tokens (Int, nullable)
- createdAt (DateTime)

**Relationships:**
- User → Conversations (1:N)
- User → Messages (1:N)
- Conversation → Messages (1:N)

## Security Architecture

### Authentication & Authorization

1. **Password Security**
   - Bcrypt hashing (12 rounds)
   - Minimum 8 characters
   - No password in responses

2. **JWT Tokens**
   - HS256 algorithm
   - 7-day expiration
   - Stored in localStorage
   - Sent in Authorization header

3. **Socket Authentication**
   - Token in handshake auth
   - Connection rejected if invalid
   - User ID attached to socket

### API Security

1. **Rate Limiting**
   - Global: 100 requests / 15 minutes
   - Auth endpoints: 5 requests / minute
   - Per-IP tracking

2. **Security Headers** (Helmet.js)
   - Content-Security-Policy
   - X-Frame-Options
   - X-Content-Type-Options
   - Strict-Transport-Security

3. **CORS**
   - Whitelist specific origins
   - Credentials allowed
   - Preflight caching

4. **Input Validation**
   - express-validator
   - Type checking
   - Sanitization

## Performance Optimizations

### Frontend

1. **Code Splitting**
   - Next.js automatic splitting
   - Dynamic imports for heavy components
   - Lazy loading

2. **State Management**
   - Zustand (lightweight)
   - Selective re-renders
   - Persistent storage

3. **Caching**
   - SWR for API calls
   - Static asset caching
   - Service worker (future)

### Backend

1. **Database**
   - Prisma connection pooling
   - Indexed queries
   - Selective field loading

2. **Caching**
   - Redis for session data
   - API response caching (future)
   - Query result caching (future)

3. **Streaming**
   - Claude API streaming
   - Socket.io chunked responses
   - Reduced perceived latency

## Scalability Considerations

### Horizontal Scaling

**Frontend:**
- Stateless Next.js instances
- Load balancer distribution
- CDN for static assets

**Backend:**
- Stateless API servers
- Sticky sessions for Socket.io
- Redis adapter for multi-instance Socket.io

**Database:**
- Read replicas
- Connection pooling
- Sharding (future)

### Monitoring & Observability

1. **Logging**
   - Winston structured logging
   - Log levels (error, warn, info, debug)
   - Rotation policies

2. **Metrics** (Future)
   - Prometheus
   - Grafana dashboards
   - Custom metrics

3. **Tracing** (Future)
   - OpenTelemetry
   - Distributed tracing
   - Performance analysis

## Deployment Architecture

### Development
```
Local Machine
├── Frontend (localhost:3000)
├── Backend (localhost:3001)
├── PostgreSQL (localhost:5432)
└── Redis (localhost:6379)
```

### Production
```
Cloud Infrastructure
├── Load Balancer
├── Frontend Instances (N)
├── Backend Instances (N)
├── PostgreSQL (Managed)
├── Redis (Managed)
└── CDN (Static Assets)
```

## Future Enhancements

1. **Microservices**
   - Separate auth service
   - Message processing service
   - Analytics service

2. **Message Queue**
   - RabbitMQ/Kafka
   - Async processing
   - Event-driven architecture

3. **Caching Layer**
   - Advanced Redis patterns
   - Cache invalidation strategies
   - Multi-tier caching

4. **API Gateway**
   - Centralized routing
   - Request transformation
   - Advanced rate limiting

5. **Service Mesh**
   - Istio/Linkerd
   - Traffic management
   - Enhanced observability
