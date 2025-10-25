# Types Package

## Overview

Shared TypeScript type definitions used across the SeaPunk Manager applications.

## Best Practices

### Type Definitions

1. **Type Organization**
   - Group related types together
   - Use descriptive names
   - Document complex types
   - Keep types focused

2. **Interface Design**

   ```typescript
   // Base interface
   interface BaseEntity {
     id: string;
     createdAt: Date;
     updatedAt: Date;
   }

   // Extended interface
   interface Character extends BaseEntity {
     name: string;
     level: number;
     class: CharacterClass;
   }
   ```

3. **Enum Definitions**
   ```typescript
   enum CharacterClass {
     Warrior = 'warrior',
     Mage = 'mage',
     Rogue = 'rogue',
   }
   ```

### Development Guidelines

1. **Type Creation**
   - Use interfaces for extendable types
   - Use type aliases for unions/intersections
   - Keep types strict and specific
   - Avoid using `any`

2. **Documentation**
   - Document all interfaces
   - Include usage examples
   - Document type constraints
   - Note breaking changes

### Validation

1. **Type Checking**
   - Run type checks regularly
   - Test type combinations
   - Verify backwards compatibility
   - Check circular dependencies

## File Structure

```
src/
├── entities/           # Database entity types
├── dtos/              # Data transfer object types
├── enums/             # Enumeration types
└── utils/             # Utility types
```

## Development Workflow

1. **Building**

   ```bash
   npm run build
   ```

2. **Type Checking**
   ```bash
   npm run typecheck
   ```

## Common Issues

1. **Type Errors**
   - Check for circular dependencies
   - Verify import paths
   - Check type compatibility

2. **Build Issues**
   - Verify TypeScript configuration
   - Check dependency versions
   - Validate export paths

## Dependencies

Check `package.json` for the complete list of dependencies and their versions.
