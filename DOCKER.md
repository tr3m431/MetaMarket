# Docker Setup for MetaMarket

This document explains how to run the MetaMarket application using Docker.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

### Production Mode

To run the application in production mode:

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### Development Mode

To run the application in development mode with hot reloading:

```bash
# Build and start all services with development configuration
docker-compose -f docker-compose.dev.yml up --build

# Or run in detached mode
docker-compose -f docker-compose.dev.yml up -d --build
```

## Services

The application consists of three main services:

### 1. Database (PostgreSQL)
- **Port**: 5432
- **Database**: metamarket
- **User**: tr3m431
- **Password**: password

### 2. Backend (FastAPI)
- **Port**: 8000
- **Framework**: FastAPI with SQLAlchemy
- **Database**: PostgreSQL
- **Features**: 
  - Automatic migrations with Alembic
  - Hot reloading in development
  - REST API endpoints

### 3. Frontend (Next.js)
- **Port**: 3000
- **Framework**: Next.js with React
- **Features**:
  - TypeScript support
  - Tailwind CSS
  - Hot reloading in development

## Environment Variables

### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `PYTHONPATH`: Python path for imports

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NODE_ENV`: Node.js environment (development/production)

## Useful Commands

### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs frontend
docker-compose logs backend
docker-compose logs db
```

### Stop services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Rebuild specific service
```bash
# Rebuild frontend
docker-compose build frontend

# Rebuild backend
docker-compose build backend
```

### Access containers
```bash
# Access frontend container
docker-compose exec frontend sh

# Access backend container
docker-compose exec backend bash

# Access database
docker-compose exec db psql -U tr3m431 -d metamarket
```

## Development Workflow

1. **Start development environment**:
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

2. **Make code changes** - they will automatically reload

3. **View logs** for debugging:
   ```bash
   docker-compose -f docker-compose.dev.yml logs -f
   ```

4. **Run tests** (from host):
   ```bash
   # Frontend tests
   npm test

   # Backend tests (if you have them)
   docker-compose exec backend python -m pytest
   ```

## Production Deployment

For production deployment:

1. Use the production docker-compose.yml
2. Set proper environment variables
3. Use a reverse proxy (nginx) for SSL termination
4. Configure proper database backups
5. Set up monitoring and logging

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 8000, and 5432 are available
2. **Database connection**: Ensure the database service is running before the backend
3. **Build failures**: Clear Docker cache with `docker system prune -a`
4. **Permission issues**: Run with appropriate user permissions

### Reset Everything
```bash
# Stop all containers and remove volumes
docker-compose down -v

# Remove all images
docker system prune -a

# Rebuild from scratch
docker-compose up --build
```

## File Structure

```
MetaMarket/
├── docker-compose.yml          # Production configuration
├── docker-compose.dev.yml      # Development configuration
├── Dockerfile                  # Production frontend
├── Dockerfile.dev             # Development frontend
├── .dockerignore              # Frontend ignore rules
├── backend/
│   ├── Dockerfile             # Backend container
│   └── .dockerignore          # Backend ignore rules
└── DOCKER.md                  # This file
``` 