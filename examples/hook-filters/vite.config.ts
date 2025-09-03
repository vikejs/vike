import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { withFilter, defineConfig } from 'vite'
import type { UserConfig } from 'vite'

// Example plugin that processes SVG files
function svgPlugin() {
  return {
    name: 'example-svg-plugin',
    transform(code: string, id: string) {
      if (id.endsWith('.svg')) {
        // Process SVG files
        return `export default ${JSON.stringify(code)}`
      }
    }
  }
}

// Example plugin that processes CSS files
function cssPlugin() {
  return {
    name: 'example-css-plugin',
    transform(code: string, id: string) {
      if (id.endsWith('.css')) {
        // Process CSS files
        return code.replace(/\/\*.*?\*\//g, '') // Remove comments
      }
    }
  }
}

export default defineConfig({
  plugins: [
    vike(),
    react(),
    
    // Example 1: Using withFilter to optimize SVG processing
    // Only calls the plugin's transform hook for .svg files
    withFilter(
      svgPlugin(),
      { 
        transform: { id: /\.svg(\?|$)/ } 
      }
    ),
    
    // Example 2: Using withFilter to optimize CSS processing
    // Only calls the plugin's transform hook for .css files
    withFilter(
      cssPlugin(),
      { 
        transform: { id: /\.css(\?|$)/ } 
      }
    ),
    
    // Example 3: Complex filter combining multiple conditions
    // Only process TypeScript files that are not in node_modules
    withFilter(
      {
        name: 'example-typescript-plugin',
        transform(code: string, id: string) {
          // Add TypeScript-specific transformations
          return code.replace(/console\.log/g, 'console.debug')
        }
      },
      {
        transform: { 
          id: /^(?!.*\/node_modules\/).*\.tsx?(\?|$)/ 
        }
      }
    ),
    
    // Example 4: Filter for specific file patterns
    // Only process files with specific query parameters
    withFilter(
      {
        name: 'example-query-plugin',
        transform(code: string, id: string) {
          // Process files with ?inline query
          return `export default ${JSON.stringify(code)}`
        }
      },
      {
        transform: { 
          id: /[?&]inline(?:&|$)/ 
        }
      }
    )
  ],
}) satisfies UserConfig
