# Clean Architecture Guide

## Overview

This project follows Clean Architecture principles with clear separation of concerns across layers.

## Architecture Layers

### 1. Domain Layer (`src/domain/`)
**Purpose**: Contains business logic, entities, and business rules. Framework-agnostic.

**Structure**:
```
domain/
  ├── entities/        # Domain entities (User, Invoice, Product, etc.)
  └── rules/          # Business rules and validations
```

**Key Principles**:
- No dependencies on other layers
- Pure business logic
- Framework-agnostic
- Testable in isolation

**Example**:
```javascript
// domain/entities/Invoice.js
export class Invoice {
  isOverdue() {
    // Business rule: Check if invoice is overdue
  }
  
  canBePaid() {
    // Business rule: Check if invoice can be paid
  }
}
```

### 2. Application Layer (`src/application/`)
**Purpose**: Contains use cases and services that orchestrate domain logic.

**Structure**:
```
application/
  └── services/       # Use case services (InvoiceService, ProductService, etc.)
```

**Key Principles**:
- Depends only on domain layer
- Orchestrates business logic
- Defines application workflows
- Framework-agnostic

**Example**:
```javascript
// application/services/InvoiceService.js
export class InvoiceService {
  async createInvoice(invoiceData) {
    // Validate business rules
    Invoice.validate(invoiceData)
    
    // Create domain entity
    const invoice = new Invoice(invoiceData)
    
    // Persist through repository
    return await this.invoiceRepository.create(invoice)
  }
}
```

### 3. Infrastructure Layer (`src/infrastructure/`)
**Purpose**: Contains adapters for external concerns (API, storage, etc.).

**Structure**:
```
infrastructure/
  ├── api/            # API client adapters
  ├── repositories/   # Data access adapters
  └── services/       # Infrastructure services (TokenService, etc.)
```

**Key Principles**:
- Implements interfaces defined by application layer
- Handles external dependencies
- Framework-specific implementations

**Example**:
```javascript
// infrastructure/repositories/InvoiceRepository.js
export class InvoiceRepository {
  async findAll() {
    const response = await this.apiClient.get('/accounting/invoices')
    return response.data || []
  }
}
```

### 4. UI Layer (`src/ui/` or `src/modules/`)
**Purpose**: Contains React components and presentation logic.

**Structure**:
```
modules/
  └── [feature]/
      ├── components/  # Feature-specific components
      ├── hooks/       # Feature-specific hooks
      └── pages/       # Feature pages
```

**Key Principles**:
- "Dumb" components (presentational)
- Calls use cases/services, not repositories directly
- No business logic in components
- Framework-specific (React)

## Feature-Based Module Structure

Organize code by feature/domain, not by type:

```
src/modules/
  ├── inventory/
  │   ├── components/
  │   ├── hooks/
  │   ├── services/    # Module-specific use cases
  │   └── pages/
  ├── crm/
  │   ├── components/
  │   ├── hooks/
  │   ├── services/
  │   └── pages/
  └── sales/
      ├── components/
      ├── hooks/
      ├── services/
      └── pages/
```

## Dependency Flow

```
UI Layer
  ↓ (depends on)
Application Layer
  ↓ (depends on)
Domain Layer
  ↑ (implemented by)
Infrastructure Layer
```

**Rule**: Dependencies point inward. Outer layers depend on inner layers, not vice versa.

## Absolute Imports

Configured in `jsconfig.json` and `vite.config.js`:

```javascript
import { Invoice } from '@domain/entities'
import { InvoiceService } from '@application/services'
import { InvoiceRepository } from '@infrastructure/repositories'
```

## State Management

### Contexts by Domain
Split contexts by feature/domain:
- `AuthContext` - Authentication state
- `InventoryContext` - Inventory state
- `InvoiceContext` - Invoice state

### For Complex State
Consider Redux Toolkit for:
- Shared state across modules
- Complex state logic
- Time-travel debugging
- Predictable state updates

## Component Patterns

### Dumb/Presentational Components
Components should:
- Receive data via props
- Call callbacks for actions
- Not contain business logic
- Be easily testable

```javascript
// ✅ Good: Dumb component
function InvoiceList({ invoices, onInvoiceClick }) {
  return (
    <div>
      {invoices.map(invoice => (
        <InvoiceCard key={invoice.id} invoice={invoice} onClick={onInvoiceClick} />
      ))}
    </div>
  )
}
```

### Custom Hooks
Extract data fetching and stateful logic:

```javascript
// hooks/useInvoices.js
export function useInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Call use case service
    invoiceService.getInvoices()
      .then(setInvoices)
      .finally(() => setLoading(false))
  }, [])
  
  return { invoices, loading }
}
```

## Testing Strategy

### Unit Tests
- **Domain entities**: Test business rules
- **Use cases**: Test application logic
- **Components**: Test UI behavior

### Integration Tests
- Test workflows end-to-end
- Test API integrations
- Test user flows

## Creating a New Module

1. **Create domain entity** (if needed):
   ```javascript
   // domain/entities/NewEntity.js
   export class NewEntity {
     // Business rules
   }
   ```

2. **Create use case service**:
   ```javascript
   // application/services/NewEntityService.js
   export class NewEntityService {
     constructor(repository) {
       this.repository = repository
     }
   }
   ```

3. **Create repository**:
   ```javascript
   // infrastructure/repositories/NewEntityRepository.js
   export class NewEntityRepository {
     async findAll() {
       // API call
     }
   }
   ```

4. **Create module structure**:
   ```
   modules/new-feature/
     ├── components/
     ├── hooks/
     └── pages/
   ```

5. **Wire up in UI**:
   ```javascript
   // Initialize services
   const repository = new NewEntityRepository(apiClient)
   const service = new NewEntityService(repository)
   
   // Use in component
   const { data } = useNewEntity(service)
   ```

## Best Practices

1. **Keep components dumb**: No business logic in UI
2. **Use dependency injection**: Pass dependencies to services
3. **Test domain logic**: Business rules should be well-tested
4. **Document use cases**: Each service should have clear documentation
5. **Follow single responsibility**: Each class/function does one thing
6. **Use interfaces/contracts**: Define clear contracts between layers

## Migration Guide

When refactoring existing code:

1. Extract business logic to domain entities
2. Move API calls to repositories
3. Create use case services
4. Refactor components to use services
5. Update imports to use absolute paths

