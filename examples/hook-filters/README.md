# Hook Filters Example

This example demonstrates how to use Vite's `withFilter` wrapper to optimize plugin performance with Rolldown by reducing JavaScript-Rust communication overhead.

## What are Hook Filters?

Hook filters are a performance optimization feature introduced in Rolldown and supported by Vite 6.3.0+. They allow you to specify patterns that filter which files should be processed by plugin hooks at the Rust level, before calling into JavaScript.

## Benefits

- **Reduced overhead**: Filters files at the Rust level before calling JavaScript hooks
- **Better performance**: Especially beneficial for plugins that only process specific file types
- **Backward compatibility**: Works with both Rolldown and Rollup 4.38.0+

## Usage Examples

### Basic Filter

```typescript
import { withFilter } from 'vite'

// Only process .svg files
withFilter(
  svgPlugin(),
  { transform: { id: /\.svg(\?|$)/ } }
)
```

### Complex Filters

```typescript
// Only process TypeScript files outside node_modules
withFilter(
  typescriptPlugin(),
  { transform: { id: /^(?!.*\/node_modules\/).*\.tsx?(\?|$)/ } }
)
```

### Query Parameter Filters

```typescript
// Only process files with ?inline query
withFilter(
  inlinePlugin(),
  { transform: { id: /[?&]inline(?:&|$)/ } }
)
```

## Available Hook Types

You can filter the following hooks:

- `resolveId`: Filter module resolution
- `load`: Filter module loading
- `transform`: Filter code transformation

## Filter Patterns

Common regex patterns for filtering:

- **File extensions**: `/\.css(\?|$)/` for CSS files
- **Exclude node_modules**: `/^(?!.*\/node_modules\/)/` 
- **Query parameters**: `/[?&]extractAssets(?:&|$)/`
- **Multiple extensions**: `/\.(js|ts|jsx|tsx)(\?|$)/`

## Vike's Built-in Optimizations

Vike automatically uses hook filters for its internal plugins:

- **Virtual files**: Only processes `virtual:vike:*` imports
- **Extract assets**: Only processes files with `?extractAssets` query
- **Script files**: Only processes JavaScript/TypeScript files
- **User files**: Excludes node_modules for better performance

## Running the Example

```bash
npm install
npm run dev
```

## Learn More

- [Vite Hook Filters Documentation](https://vite.dev/guide/rolldown.html#hook-filter-feature)
- [Rolldown Plugin Utils](https://github.com/rolldown/rolldown/tree/main/packages/rolldown-plugin-utils)
- [Vike Performance Guide](https://vike.dev/performance)
