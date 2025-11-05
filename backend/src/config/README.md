# Database Configuration

This directory contains database configuration for the application.

## Setup

The application supports two repository implementations:

1. **InMemory** (default) - For development and testing
2. **PostgreSQL** - For production use

## Configuration

### Environment Variables

Set the following in your `.env` file:

```env
# Enable PostgreSQL (default: false, uses InMemory)
USE_DATABASE=true

# PostgreSQL Configuration (required if USE_DATABASE=true)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=frituur_ordering
```

### Switching Between Implementations

- **InMemory** (default): Don't set `USE_DATABASE` or set it to `false`
- **PostgreSQL**: Set `USE_DATABASE=true` and configure database connection

## Usage

The `DatabaseModule` in `src/core/database/database.module.ts` automatically configures TypeORM based on the `USE_DATABASE` environment variable.

## Repository Pattern

All repositories implement the same interface, allowing easy switching between implementations:

- `InMemoryOrderRepository` - Async in-memory storage (returns Promises)
- `PostgreSQLOrderRepository` - Async PostgreSQL storage

## Note on Async Operations

All repository interfaces are now async (Promise-based) for production readiness. Both InMemory and PostgreSQL implementations support async operations, making it easy to switch between implementations without code changes.
