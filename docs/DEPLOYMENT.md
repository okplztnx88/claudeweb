# Deployment Guide

This guide covers deploying ClaudeWeb to various environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment](#cloud-deployment)
5. [Database Migration](#database-migration)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required

- Node.js 18+
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose (for containerized deployment)

### Recommended

- Nginx or similar reverse proxy
- SSL certificate
- Domain name
- CDN for static assets

## Environment Variables

### Backend Variables

```env
# Server
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=postgresql://user:password@host:5432/claudeweb

# Redis
REDIS_URL=redis://host:6379

# JWT
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d

# Claude API
ANTHROPIC_API_KEY=<your-api-key>

# Security
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### Frontend Variables

```env
# API URLs
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com

# Build
NODE_ENV=production
```

## Docker Deployment

### Option 1: Docker Compose (Recommended for Small Deployments)

1. **Create production docker-compose file**

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: claudeweb
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: claudeweb
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    restart: unless-stopped

  backend:
    build:
      context: .
      dockerfile: apps/backend/Dockerfile
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://claudeweb:${POSTGRES_PASSWORD}@postgres:5432/claudeweb
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
      CORS_ORIGIN: ${CORS_ORIGIN}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: apps/frontend/Dockerfile
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
      NEXT_PUBLIC_WS_URL: ${NEXT_PUBLIC_WS_URL}
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres-data:
  redis-data:
```

2. **Deploy**

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Option 2: Kubernetes

1. **Create Kubernetes manifests**

See `k8s/` directory for example manifests.

2. **Deploy to cluster**

```bash
kubectl apply -f k8s/
```

## Cloud Deployment

### AWS Deployment

#### Using ECS (Elastic Container Service)

1. **Push images to ECR**

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag images
docker tag claudeweb-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/claudeweb-backend:latest
docker tag claudeweb-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/claudeweb-frontend:latest

# Push images
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/claudeweb-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/claudeweb-frontend:latest
```

2. **Set up RDS (PostgreSQL)**
3. **Set up ElastiCache (Redis)**
4. **Create ECS Task Definitions**
5. **Deploy ECS Services**
6. **Configure ALB (Application Load Balancer)**

#### Using Elastic Beanstalk

```bash
eb init
eb create production
eb deploy
```

### Vercel Deployment (Frontend Only)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/frontend
vercel --prod
```

### Railway Deployment

1. **Create Railway project**
2. **Add PostgreSQL and Redis plugins**
3. **Deploy backend and frontend services**
4. **Configure environment variables**

### DigitalOcean App Platform

1. **Create App**
2. **Connect GitHub repo**
3. **Configure components:**
   - Frontend (Next.js)
   - Backend (Node.js)
   - PostgreSQL database
   - Redis database

## Database Migration

### Initial Setup

```bash
# Generate Prisma client
cd apps/backend
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy
```

### Creating Migrations

```bash
# Development
pnpm prisma migrate dev --name description

# Production
pnpm prisma migrate deploy
```

### Backup & Restore

```bash
# Backup
pg_dump -U username -h hostname dbname > backup.sql

# Restore
psql -U username -h hostname dbname < backup.sql
```

## Nginx Configuration

```nginx
# nginx.conf
upstream backend {
    server backend:3001;
}

upstream frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

## SSL/TLS Setup

### Let's Encrypt (Certbot)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Monitoring

### Logging

Logs are written to:
- `logs/combined.log` - All logs
- `logs/error.log` - Errors only

### Health Checks

```bash
# Backend health
curl https://api.yourdomain.com/health

# Expected response
{"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

### Recommended Monitoring Tools

- **Application:** New Relic, DataDog, or Sentry
- **Infrastructure:** Prometheus + Grafana
- **Logs:** ELK Stack or Loki
- **Uptime:** Pingdom or UptimeRobot

## Performance Tuning

### PostgreSQL

```sql
-- Increase connection pool
ALTER SYSTEM SET max_connections = 200;

-- Enable query logging for slow queries
ALTER SYSTEM SET log_min_duration_statement = 1000;
```

### Redis

```conf
# redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru
```

### Node.js

```bash
# Increase memory limit
NODE_OPTIONS="--max-old-space-size=4096"
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Database backups enabled
- [ ] Monitor error logs
- [ ] Implement monitoring/alerting

## Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

**Redis Connection Failed**
```bash
# Check Redis is running
docker-compose ps redis

# Test connection
redis-cli -u $REDIS_URL ping
```

**Frontend Can't Connect to Backend**
- Verify CORS_ORIGIN matches frontend URL
- Check NEXT_PUBLIC_API_URL is correct
- Ensure backend is accessible

**WebSocket Connection Failed**
- Check Socket.io transports configuration
- Verify WebSocket support in proxy (Nginx)
- Check firewall rules

### Rollback Procedure

```bash
# Using Docker
docker-compose down
git checkout <previous-commit>
docker-compose build
docker-compose up -d

# Database rollback
pnpm prisma migrate resolve --rolled-back <migration-name>
```

## Scaling

### Horizontal Scaling

1. **Frontend:**
   - Deploy multiple instances
   - Use load balancer
   - Serve static assets from CDN

2. **Backend:**
   - Deploy multiple instances
   - Use Redis adapter for Socket.io
   - Sticky sessions for WebSocket

3. **Database:**
   - Read replicas
   - Connection pooling
   - Consider sharding for large scale

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Implement caching strategies

## Support

For deployment issues:
1. Check application logs
2. Review this documentation
3. Open an issue on GitHub
4. Contact support team
