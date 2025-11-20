# ORM Management System

Enterprise Business Management Platform built with React and Clean Architecture principles.

## Architecture

This project follows **Clean Architecture** with clear separation of concerns:

- **Domain Layer**: Business logic and entities (framework-agnostic)
- **Application Layer**: Use cases and services
- **Infrastructure Layer**: API clients, repositories, adapters
- **UI Layer**: React components (presentational)

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── domain/              # Business logic & entities
│   └── entities/       # Domain entities (User, Invoice, Product, etc.)
├── application/         # Use cases & services
│   └── services/       # Application services (InvoiceService, etc.)
├── infrastructure/      # External adapters
│   ├── api/           # API client
│   ├── repositories/  # Data access layer
│   └── services/      # Infrastructure services
├── modules/           # Feature-based modules
│   ├── invoices/
│   ├── products/
│   └── ...
├── ui/                # Shared UI components
├── contexts/          # React contexts
├── hooks/             # Shared hooks
└── utils/             # Utility functions
```

## Key Features

- ✅ Clean Architecture with layered separation
- ✅ Feature-based module organization
- ✅ Domain-driven design
- ✅ Dependency injection
- ✅ Type-safe with JSDoc
- ✅ Responsive design
- ✅ Loading states and error handling
- ✅ Code splitting and lazy loading

## Development

### Creating a New Feature

See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for step-by-step instructions.

### Code Style

- Use absolute imports: `@domain/entities` not `../../domain/entities`
- Keep components "dumb" (presentational)
- Business logic in domain/application layers
- Follow naming conventions (see DEVELOPER_GUIDE.md)

### Testing

```bash
# Run tests (when configured)
npm test
```

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture overview and patterns
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Developer onboarding and guidelines

## License

MIT
