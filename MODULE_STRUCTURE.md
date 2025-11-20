# Module Structure Guide

## Overview

This project uses a **feature-based modular architecture** where each business domain is self-contained.

## Directory Structure

```
src/
├── domain/                    # Business logic & entities (framework-agnostic)
│   ├── entities/             # Domain entities (User, Invoice, Product, etc.)
│   └── valueObjects/         # Value objects (Money, Currency, etc.)
│
├── application/               # Use cases & services
│   └── services/             # Application services (InvoiceService, etc.)
│
├── infrastructure/            # External adapters
│   ├── api/                  # API client
│   ├── repositories/         # Data access layer
│   └── services/             # Infrastructure services
│
├── modules/                   # Feature-based modules
│   ├── accounting/
│   │   ├── components/       # Module-specific components
│   │   ├── hooks/            # Module-specific hooks
│   │   ├── services/         # Module API adapters
│   │   ├── types/            # Module type definitions
│   │   └── pages/            # Module pages
│   │
│   ├── crm/
│   ├── inventory/
│   ├── sales/
│   ├── hr/
│   ├── workflow/
│   └── ai/
│
├── shared/                    # Shared across modules
│   ├── components/           # Shared UI components
│   ├── contexts/             # Domain-specific contexts
│   ├── hooks/                # Shared hooks
│   └── utils/                # Shared utilities
│
└── ui/                        # Base UI components (if needed)
```

## Module Structure

Each module follows this structure:

```
modules/[domain]/
├── components/        # Presentational components
├── hooks/            # Custom hooks for data fetching
├── services/         # API adapters (infrastructure)
├── types/            # Type definitions (JSDoc)
└── pages/            # Page components
```

## Creating a New Module

### Step 1: Create Module Directory

```bash
mkdir -p src/modules/my-module/{components,hooks,services,types,pages}
```

### Step 2: Create Types

```javascript
// modules/my-module/types/index.js
/**
 * @typedef {Object} MyEntity
 * @property {string} id
 * @property {string} name
 */
```

### Step 3: Create API Service

```javascript
// modules/my-module/services/myEntityApi.js
import { apiClient } from '@infrastructure/api'

export const myEntityApi = {
  getAll: () => apiClient.get('/my-entities'),
  getById: (id) => apiClient.get(`/my-entities/${id}`),
  create: (data) => apiClient.post('/my-entities', data),
}
```

### Step 4: Create Custom Hook

```javascript
// modules/my-module/hooks/useMyEntity.js
import { useState, useEffect } from 'react'
import { myEntityApi } from '../services/myEntityApi'

export function useMyEntity() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    myEntityApi.getAll()
      .then(res => setData(res.data))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}
```

### Step 5: Create Component

```javascript
// modules/my-module/components/MyEntityList.jsx
import { useMyEntity } from '../hooks/useMyEntity'
import { TableSkeleton } from '@shared/components/Skeleton'

export function MyEntityList() {
  const { data, loading, error } = useMyEntity()

  if (loading) return <TableSkeleton />
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

## Module Communication

Modules should communicate through:
1. **Shared contexts** (for cross-module state)
2. **Application services** (for business logic)
3. **Events** (for loose coupling)

Avoid direct imports between modules.

## Best Practices

1. **Keep modules independent**: Each module should be self-contained
2. **Use shared components**: Put reusable UI in `shared/components`
3. **Define types**: Use JSDoc for type definitions
4. **Lazy load modules**: Use React.lazy for code splitting
5. **Test modules**: Write tests for each module

## Module Responsibilities

### Components
- Presentational only
- Receive data via props
- Call callbacks for actions
- No business logic

### Hooks
- Data fetching
- State management
- Call API services
- Handle loading/error states

### Services
- API adapters
- Data transformation
- No business logic (that's in application layer)

### Types
- JSDoc type definitions
- API contracts
- Domain models

