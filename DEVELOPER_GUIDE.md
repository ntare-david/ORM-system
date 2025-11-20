# Developer Onboarding Guide

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
src/
├── domain/              # Business logic & entities
├── application/         # Use cases & services
├── infrastructure/      # API clients & adapters
├── modules/            # Feature-based modules
├── ui/                 # Shared UI components
├── contexts/           # React contexts
├── hooks/              # Shared hooks
└── utils/              # Utility functions
```

## Creating a New Feature Module

### Step 1: Create Domain Entity (if needed)

```javascript
// src/domain/entities/MyEntity.js
export class MyEntity {
  constructor(data) {
    this.id = data.id
    this.name = data.name
  }

  // Business rules
  isValid() {
    return this.name && this.name.length > 0
  }
}
```

### Step 2: Create Repository

```javascript
// src/infrastructure/repositories/MyEntityRepository.js
export class MyEntityRepository {
  constructor(apiClient) {
    this.apiClient = apiClient
  }

  async findAll() {
    const response = await this.apiClient.get('/my-entities')
    return response.data || []
  }

  async create(entity) {
    const response = await this.apiClient.post('/my-entities', entity)
    return response.data
  }
}
```

### Step 3: Create Use Case Service

```javascript
// src/application/services/MyEntityService.js
import { MyEntity } from '@domain/entities'

export class MyEntityService {
  constructor(repository) {
    this.repository = repository
  }

  async getEntities() {
    const data = await this.repository.findAll()
    return data.map(item => new MyEntity(item))
  }

  async createEntity(entityData) {
    const entity = new MyEntity(entityData)
    if (!entity.isValid()) {
      throw new Error('Invalid entity')
    }
    return await this.repository.create(entity)
  }
}
```

### Step 4: Create Module Structure

```
src/modules/my-feature/
├── components/
│   └── MyFeatureList.jsx
├── hooks/
│   └── useMyFeature.js
└── pages/
    └── MyFeaturePage.jsx
```

### Step 5: Create Custom Hook

```javascript
// src/modules/my-feature/hooks/useMyFeature.js
import { useState, useEffect } from 'react'
import { MyEntityService } from '@application/services'
import { MyEntityRepository } from '@infrastructure/repositories'
import { apiClient } from '@infrastructure/api'

export function useMyFeature() {
  const [entities, setEntities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const repository = new MyEntityRepository(apiClient)
    const service = new MyEntityService(repository)

    service.getEntities()
      .then(setEntities)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { entities, loading, error }
}
```

### Step 6: Create Component

```javascript
// src/modules/my-feature/components/MyFeatureList.jsx
import { useMyFeature } from '../hooks/useMyFeature'
import { TableSkeleton } from '@ui/components/Skeleton'

export function MyFeatureList() {
  const { entities, loading, error } = useMyFeature()

  if (loading) return <TableSkeleton />
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {entities.map(entity => (
        <div key={entity.id}>{entity.name}</div>
      ))}
    </div>
  )
}
```

## Code Style Guidelines

### Naming Conventions
- **Entities**: PascalCase (`Invoice`, `Product`)
- **Services**: PascalCase with "Service" suffix (`InvoiceService`)
- **Repositories**: PascalCase with "Repository" suffix (`InvoiceRepository`)
- **Components**: PascalCase (`InvoiceList`, `ProductCard`)
- **Hooks**: camelCase with "use" prefix (`useInvoices`, `useProducts`)
- **Files**: Match the export name

### Component Structure
```javascript
// 1. Imports
import { useState } from 'react'
import { MyService } from '@application/services'

// 2. Component
export function MyComponent({ prop1, prop2 }) {
  // 3. Hooks
  const [state, setState] = useState()
  
  // 4. Effects
  useEffect(() => {
    // ...
  }, [])
  
  // 5. Handlers
  const handleClick = () => {
    // ...
  }
  
  // 6. Render
  return <div>...</div>
}
```

## Testing

### Unit Tests
```javascript
// __tests__/domain/entities/Invoice.test.js
import { Invoice } from '@domain/entities'

describe('Invoice', () => {
  it('should check if invoice is overdue', () => {
    const invoice = new Invoice({
      dueDate: new Date('2020-01-01'),
      status: 'pending'
    })
    expect(invoice.isOverdue()).toBe(true)
  })
})
```

### Component Tests
```javascript
// __tests__/components/InvoiceList.test.jsx
import { render, screen } from '@testing-library/react'
import { InvoiceList } from '@modules/invoices/components/InvoiceList'

describe('InvoiceList', () => {
  it('renders invoices', () => {
    const invoices = [{ id: 1, name: 'Invoice 1' }]
    render(<InvoiceList invoices={invoices} />)
    expect(screen.getByText('Invoice 1')).toBeInTheDocument()
  })
})
```

## Common Patterns

### Error Handling
```javascript
try {
  const result = await service.doSomething()
} catch (error) {
  // Handle error
  console.error(error)
  showToast(error.message, 'error')
}
```

### Loading States
```javascript
const [loading, setLoading] = useState(true)

useEffect(() => {
  setLoading(true)
  fetchData()
    .finally(() => setLoading(false))
}, [])
```

### Memoization
```javascript
// Memoize expensive calculations
const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0)
}, [items])

// Memoize callbacks
const handleClick = useCallback(() => {
  // ...
}, [dependencies])
```

## Best Practices

1. **Keep components small**: One component, one responsibility
2. **Extract business logic**: Move logic to domain/services
3. **Use TypeScript/JSDoc**: Document types and interfaces
4. **Write tests**: Test business logic and critical paths
5. **Follow naming conventions**: Be consistent
6. **Document complex logic**: Add comments for non-obvious code
7. **Use absolute imports**: `@domain/entities` not `../../domain/entities`
8. **Handle errors gracefully**: Show user-friendly error messages

## Troubleshooting

### Import Errors
- Check `jsconfig.json` paths are correct
- Verify file paths match import paths
- Restart dev server after changing config

### API Errors
- Check API base URL in `infrastructure/api/ApiClient.js`
- Verify backend is running
- Check network tab in browser dev tools

### State Issues
- Use React DevTools to inspect state
- Check context providers are wrapping components
- Verify hooks are called at component top level

## Resources

- [React Documentation](https://react.dev)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Testing Library](https://testing-library.com/react)

