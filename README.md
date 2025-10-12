# 🍟 Frituur Ordering System

> A modern ordering system for frituur restaurants with real-time updates and multilingual support

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Flutter](https://img.shields.io/badge/Flutter-02569B?logo=flutter&logoColor=white)](https://flutter.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://postgresql.org/)

## 🎯 Project Overview

A complete ordering system that lets customers order food online and helps kitchen staff manage orders efficiently. Built as a modular monolith with Flutter frontend and NestJS backend.

### Key Features

- 📱 **Cross-platform app** - Flutter web and mobile
- 🌍 **Multilingual support** - Dutch and English
- ⚡ **Real-time updates** - WebSocket-powered live updates
- 💳 **Secure payments** - Stripe integration
- 👨‍🍳 **Kitchen workflow** - Order queue and status management
- 📊 **Admin panel** - Menu and order management

## 🛠️ Tech Stack

### Frontend
- **Flutter 3.16+** - Cross-platform UI framework
- **Provider** - State management
- **WebSocket** - Real-time communication

### Backend
- **NestJS** - Node.js framework
- **TypeORM** - Database ORM
- **PostgreSQL 14+** - Primary database
- **WebSocket Gateway** - Real-time updates

### External Services
- **Stripe** - Payment processing
- **Docker** - Containerization

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Flutter 3.16+
- PostgreSQL 14+
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frituur-ordering-system
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database and Stripe configuration
   npm run start:dev
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   flutter pub get
   flutter run -d web
   ```

4. **Set up the database**
   ```bash
   createdb frituur_ordering
   npm run migration:run
   npm run seed
   ```

### Docker Setup (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
frituur-ordering-system/
├── frontend/                 # Flutter application
│   ├── lib/
│   │   ├── app/             # App configuration
│   │   ├── features/        # Feature modules
│   │   ├── shared/          # Shared components
│   │   └── l10n/           # Localization
│   ├── test/               # Unit tests
│   └── integration_test/   # Integration tests
├── backend/                 # NestJS application
│   ├── src/
│   │   ├── modules/        # Business modules
│   │   ├── shared/         # Shared utilities
│   │   └── config/         # Configuration
│   ├── test/              # Unit tests
│   └── e2e/               # End-to-end tests
├── docs/                   # Documentation
│   ├── technical-design.md
│   ├── implementation-plan.md
│   └── api/               # API documentation
├── scripts/               # Build and deployment scripts
├── tests/                # Cross-platform tests
└── docker-compose.yml    # Docker configuration
```

## 🏗️ Architecture

The system follows a **Modular Monolith** architecture with clear separation of concerns:

- **Catalog Module** - Menu items and categories
- **Ordering Module** - Shopping cart and orders
- **Pricing Module** - Price calculations
- **Payments Module** - Stripe integration
- **Kitchen Module** - Order queue management
- **i18n Module** - Multilingual support

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test              # Unit tests
npm run test:e2e          # End-to-end tests
npm run test:cov          # Coverage report
```

### Frontend Tests
```bash
cd frontend
flutter test              # Unit tests
flutter test integration_test/  # Integration tests
```

## 📚 Documentation

- [Technical Design](docs/technical-design.md) - System architecture and design decisions
- [Implementation Plan](docs/implementation-plan.md) - 6-week development timeline
- [API Documentation](docs/api/) - REST API and WebSocket documentation
- [User Guide](docs/user-guide.md) - How to use the system

## 🚀 Deployment

### Production Deployment

1. **Build the applications**
   ```bash
   # Backend
   cd backend && npm run build
   
   # Frontend
   cd frontend && flutter build web
   ```

2. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 📊 Performance Goals

| Metric | Target | Status |
|--------|--------|--------|
| Page Load | <2 seconds | ✅ |
| API Response | <500ms | ✅ |
| Real-time Updates | <100ms | ✅ |
| Concurrent Users | 100+ | ✅ |

## 🎓 Academic Project

**Course**: Software Engineering Project  
**Student**: Nikolaos Sporidis  
**Duration**: 6 weeks 
**Institution**: Howest Brugge

## 🤝 Contributing

This is an academic project, but suggestions and feedback are welcome!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Flutter team for the amazing framework
- NestJS team for the robust backend framework
- Stripe for secure payment processing
- PostgreSQL community for the reliable database

---
